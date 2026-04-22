import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import API from "../api";

function Dashboard() {
    const [expenses, setExpenses] = useState([]);
    const [form, setForm] = useState({ title: "", amount: "", category: "" });

    const token = localStorage.getItem("token");

    const fetchExpenses = useCallback(async () => {
        try {
            const res = await axios.get(`${API}/api/expenses`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExpenses(res.data);
        } catch (err) {
            console.error(err);
        }
    }, [token]);

    const addExpense = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API}/api/expenses`, form, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchExpenses();
        } catch (err) {
            console.error(err);
            alert("Error adding expense");
        }
    };

    const deleteExpense = async (id) => {
        try {
            await axios.delete(`${API}/api/expenses/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchExpenses();
        } catch (err) {
            console.error(err);
            alert("Delete failed");
        }
    };

    useEffect(() => {
        if (token) {
            fetchExpenses();
        }
    }, [fetchExpenses, token]);

    return (
        <div className="container">
            <h2>Dashboard</h2>

            <form onSubmit={addExpense}>
                <input placeholder="Title" onChange={e => setForm({ ...form, title: e.target.value })} />
                <input
                    type="number"
                    placeholder="Amount"
                    onChange={e => setForm({ ...form, amount: Number(e.target.value) })}
                />
                <input
                    placeholder="Enter Type / Category"
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                />
                <button>Add Expense</button>
            </form>

            <div className="expense-list">
                {expenses.map(exp => (
                    <div className="expense-card" key={exp._id}>
                        <div className="expense-header">
                            <h3>{exp.title}</h3>
                            <span className="amount">₹{exp.amount}</span>
                        </div>

                        <div className="expense-footer">
                            <span>{exp.category}</span>
                        </div>

                        <button
                            style={{ marginTop: "10px", background: "#ff4d4d" }}
                            onClick={() => deleteExpense(exp._id)}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;