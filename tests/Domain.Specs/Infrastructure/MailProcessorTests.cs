using System.Reflection;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NSubstitute;
using Polly;
using Polly.Registry;
using Domain.Common.Repositories;
using Infrastructure.Mails;

namespace Domain.Specs.Infrastructure;

public sealed class MailProcessorTests
{
    [Fact]
    public async Task ExecuteAsync_WhenStoppingTokenIsCancelled_ShouldCompleteWithoutException()
    {
        using var serviceProvider = BuildServiceProvider();
        var processor = CreateProcessor(serviceProvider);
        using var cancellationTokenSource = new CancellationTokenSource();

        var executeTask = InvokeExecuteAsync(processor, cancellationTokenSource.Token);
        cancellationTokenSource.CancelAfter(TimeSpan.FromMilliseconds(50));

        var exception = await Record.ExceptionAsync(async () => await executeTask);

        Assert.Null(exception);
    }

    private static ServiceProvider BuildServiceProvider()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddScoped(_ => Substitute.For<IMailRepository>());
        services.AddScoped(_ => Substitute.For<IMailClient>());
        return services.BuildServiceProvider();
    }

    private static MailProcessor CreateProcessor(ServiceProvider serviceProvider)
    {
        var scopeFactory = serviceProvider.GetRequiredService<IServiceScopeFactory>();
        var pipelineProvider = Substitute.For<ResiliencePipelineProvider<string>>();
        pipelineProvider.GetPipeline("mail-pipeline").Returns(ResiliencePipeline.Empty);
        var logger = serviceProvider.GetRequiredService<ILogger<MailProcessor>>();
        var bodyBuilder = Substitute.For<IMailBodyBuilder>();

        return new MailProcessor(bodyBuilder, scopeFactory, pipelineProvider, logger);
    }

    private static Task InvokeExecuteAsync(MailProcessor processor, CancellationToken cancellationToken)
    {
        var executeAsyncMethod = typeof(MailProcessor).GetMethod("ExecuteAsync", BindingFlags.Instance | BindingFlags.NonPublic);
        if (executeAsyncMethod is null)
            throw new InvalidOperationException("ExecuteAsync method was not found.");

        var task = executeAsyncMethod.Invoke(processor, [cancellationToken]) as Task;
        return task ?? throw new InvalidOperationException("ExecuteAsync returned a null task.");
    }
}
