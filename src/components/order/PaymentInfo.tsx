
interface PaymentInfoProps {
  paymentInfo: any;
}

const PaymentInfo = ({ paymentInfo }: PaymentInfoProps) => {
  if (!paymentInfo) return null;
  
  return (
    <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-200">
      <p className="text-green-700 font-medium">Payment Completed via Stripe</p>
      <p className="text-sm text-green-600">Transaction ID: {paymentInfo.id}</p>
      <p className="text-xs text-gray-500 mt-1">
        This payment was processed in Stripe test mode. You can view this transaction in your Stripe dashboard.
      </p>
      {paymentInfo.testDetails && (
        <p className="text-xs text-gray-500 mt-1">{paymentInfo.testDetails}</p>
      )}
    </div>
  );
};

export default PaymentInfo;
