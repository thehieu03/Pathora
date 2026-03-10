namespace Domain.ApiThirdPatyResponse
{
    public class SepayApiResponse
    {
        public int Status { get; set; }
        public object? Error { get; set; }
        public Messages? Messages { get; set; }
        public List<Transaction>? Transactions { get; set; }
    }
    public class Messages
    {
        public bool Success { get; set; }
    }
    public class Transaction
    {
        public string? id { get; set; }
        public string? bank_brand_name { get; set; }
        public string? account_number { get; set; }
        public string? transaction_date { get; set; }
        public string? amount_out { get; set; }
        public string? amount_in { get; set; }
        public string? accumulated { get; set; }
        public string? transaction_content { get; set; }
        public string? reference_number { get; set; }
        public string? Code { get; set; }
        public string? SubAccount { get; set; }
        public string? bank_account_id { get; set; }
    }
}
