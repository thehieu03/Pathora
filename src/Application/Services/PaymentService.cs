using ErrorOr;
using static MongoDB.Driver.WriteConcern;

namespace Application.Services;

public interface IPaymentService
{
    Task<ErrorOr<string>> GetQR(Guid id);
    Task<ErrorOr<string>> GetQRTest(string note, long amount);


}
public class PaymentService : IPaymentService
{
    public Task<ErrorOr<string>> GetQR(Guid id)
    {
        throw new NotImplementedException();
    }
    public Task<ErrorOr<string>> GetQRTest(string note, long amount)
    {
        var url = $"https://qr.sepay.vn/img?acc=0378175727&bank=MB&amount={amount}&des={note}&template=TEMPLATE&download=false";
        return Task.FromResult<ErrorOr<string>>(url);
    }
}
