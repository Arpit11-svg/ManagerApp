import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import API from "../api";

function Dashboard() {
    const [expenses, setExpenses] = useState([]);
    const [form, setForm] = useState({
        itemName: "",
        description: "",
        type: "",
        location: "",
        date: "",
        contactInfo: ""
    });

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

        // 🔥 VALIDATION BEFORE API CALL
        if (
            !form.itemName ||
            !form.description ||
            !form.type ||
            !form.location ||
            !form.contactInfo
        ) {
            alert("Please fill all fields");
            return;
        }

        try {
            await axios.post(`${API}/api/expenses`, form, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setForm({
                itemName: "",
                description: "",
                type: "",
                location: "",
                date: "",
                contactInfo: ""
            });

            fetchExpenses();

        } catch (err) {
            console.error(err.response?.data || err.message);
            alert("Error adding Item");
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
            <h2>Lost and Found</h2>

            <form onSubmit={addExpense}>
                <input
                    value={form.itemName}
                    placeholder="Item Name"
                    onChange={e => setForm({ ...form, itemName: e.target.value })}
                />
                <input
                    value={form.description}
                    placeholder="Description"
                    onChange={e => setForm({ ...form, description: e.target.value })}
                />

                <select
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value })}
                >
                    <option value="">Select Type</option>
                    <option value="Lost">Lost</option>
                    <option value="Found">Found</option>
                </select>

                <input
                    value={form.location}
                    placeholder="Location"
                    onChange={e => setForm({ ...form, location: e.target.value })}
                />

                <input
                    value={form.date}
                    type="date"
                    onChange={e => setForm({ ...form, date: e.target.value })}
                />

                <input
                    value={form.contactInfo}
                    placeholder="Contact Info"
                    onChange={e => setForm({ ...form, contactInfo: e.target.value })}
                />
                <button>Add Item</button>
            </form>

            <div className="expense-list">
                {expenses.map(exp => (
                    <div className="expense-card" key={exp._id}>
                        <div className="expense-header">
                            <h3>{exp.itemName}</h3>
                        </div>

                        <div className="expense-footer">
                            <p>{exp.description}</p>
                            <p>🔎 {exp.type}</p>
                            <p>📍 {exp.location}</p>
                            <p>📅 {new Date(exp.date).toLocaleDateString()}</p>
                            <p>📞 {exp.contactInfo}</p>
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