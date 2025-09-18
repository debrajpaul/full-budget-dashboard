import { currency } from '@/lib/format';

export default function CreditCard({
  balance,
  cardNumber,
  holder,
}: {
  balance: number;
  cardNumber: string;
  holder: string;
}) {
  return (
    <div className="relative p-6 rounded-2xl bg-gradient-to-br from-accentBlue to-accentGreen text-white shadow-md h-44 flex flex-col justify-between">
      <div>
        <p className="text-sm opacity-75">Your Balance</p>
        <p className="text-3xl font-bold mt-1">{currency(balance)}</p>
      </div>
      <div className="flex justify-between items-end text-sm opacity-80">
        <span>{cardNumber}</span>
        <span>{holder}</span>
      </div>
    </div>
  );
}
