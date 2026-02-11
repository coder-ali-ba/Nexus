import React, { useState } from "react";
import { entrepreneurs } from '../../data/users'
import { investors } from '../../data/users'


interface Transaction {
  id: number;
  amount: number;
  sender: string;
  receiver: string;
  status: "Completed" | "Pending" | "Failed";
}

export default function PaymentSection() {
  const [balance, setBalance] = useState<number>(2500);
  const [amount, setAmount] = useState<number>(0);
  const [pin, setPin] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw" | "transfer">("deposit");

  const isInvestor =localStorage.getItem("business_nexus_user")  ;
    const user = JSON.parse(isInvestor)

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, amount: 300, sender: "Investor A", receiver: "You", status: "Completed" },
    { id: 2, amount: 120, sender: "You", receiver: "Entrepreneur B", status: "Pending" },
  ]);

  const handleAction = () => {
    if (!amount) return;

    // Mock PIN validation (frontend only)
    if ((activeTab === "transfer" || activeTab === "withdraw") && pin.length < 4) {
      alert("Enter 4-digit PIN");
      return;
    }

    const newTx: Transaction = {
      id: Date.now(),
      amount,
      sender: activeTab === "deposit" ? "Investor" : "You",
      receiver:
        activeTab === "withdraw"
          ? "Bank"
          : activeTab === "transfer"
          ? receiver || "Entrepreneur"
          : "You",
      status: "Completed",
    };

    if (activeTab === "deposit") setBalance((b) => b + amount);
    if (activeTab === "withdraw") setBalance((b) => b - amount);
    if (activeTab === "transfer") setBalance((b) => b - amount);

    setTransactions((prev) => [newTx, ...prev]);
    setAmount(0);
  
    setPin("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Wallet Balance */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold">Wallet Balance</h2>
          <p className="text-3xl font-bold mt-2">${balance.toFixed(2)}</p>
        </div>

        {/* Payment Actions */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <div className="flex gap-3">
            {(["deposit", "withdraw", "transfer"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl capitalize transition ${
                  activeTab === tab ? "bg-black text-white" : "bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Enter amount"
              className="border rounded-xl px-4 py-2 w-full"
            />

            {/* Receiver Input */}
            <select className="border rounded-xl">
            {user.role =="entrepreneur" && investors.map((investor)=>(
                <option key={investor.id} value={investor.name}>{investor.name}</option>
            ))}    

            {user.role =="investor" && entrepreneurs.map((entrepreneur)=>(
                <option key={entrepreneur.id} value={entrepreneur.name}>{entrepreneur.name} </option>
            ))}         
            </select>

            {/* PIN Input */}
            {(activeTab === "transfer" || activeTab === "withdraw") && (
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 4-digit PIN"
                className="border rounded-xl px-4 py-2 w-full"
              />
            )}
          </div>

          <button
            onClick={handleAction}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl"
          >
            Confirm Transaction
          </button>
        </div>

        {/* Funding Deal Mock Flow */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold mb-3">Funding Deal Flow</h3>
          <div className="flex items-center justify-between text-sm">
            <div className="p-3 bg-gray-100 rounded-xl">Investor</div>
            <span>→</span>
            <div className="p-3 bg-gray-100 rounded-xl">Platform Wallet</div>
            <span>→</span>
            <div className="p-3 bg-gray-100 rounded-xl">Entrepreneur</div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Transaction History</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Amount</th>
                  <th>Sender</th>
                  <th>Receiver</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">${tx.amount}</td>
                    <td>{tx.sender}</td>
                    <td>{tx.receiver}</td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          tx.status === "Completed"
                            ? "bg-green-100 text-green-600"
                            : tx.status === "Pending"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
