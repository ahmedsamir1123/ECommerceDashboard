import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs } from "firebase/firestore";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import "chart.js/auto";

export default function Home() {
    const user = useSelector((state) => state.auth.user);
    const [messages, setMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [adminCount, setAdminCount] = useState(0);


    const [salesData, setSalesData] = useState([0, 0]); 
    const [weeklyProfit, setWeeklyProfit] = useState([0, 0]); 
    const [userCount, setUserCount] = useState(0); 

    useEffect(() => {
        const fetchMessages = async () => {
            const querySnapshot = await getDocs(collection(db, "inbox"));
            const msgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(msgs);
            setUnreadCount(msgs.filter(msg => !msg.isRead).length);
        };
  

        const fetchSalesData = async () => {
            const querySnapshot = await getDocs(collection(db, "orders"));
            const sales = [0, 0]; 
            const profit = [0, 0]; 
            querySnapshot.docs.forEach(doc => {
                const order = doc.data();
                const orderDate = new Date(order.timestamp.seconds * 1000); 
                const week = Math.floor((orderDate.getDate() - 1) / 7); 

                
                if (week === 2 || week === 3) {
                    const periodIndex = week < 2 ? 0 : 1; 
                    order.products.forEach(product => {
                        const productPrice = parseFloat(product.price);
                        const productQuantity = parseInt(product.quantity);
                        const totalPrice = productPrice * productQuantity;

                        sales[periodIndex] += totalPrice;
                        profit[periodIndex] += totalPrice * 0.2; 
                    });
                }
            });
            setSalesData(sales);
            setWeeklyProfit(profit);
        };

        const fetchUsersAndAdmins = async () => {
          const userQuerySnapshot = await getDocs(collection(db, "users"));
          const adminQuerySnapshot = await getDocs(collection(db, "admin"));
          
          setUserCount(userQuerySnapshot.docs.length);
          setAdminCount(adminQuerySnapshot.docs.length);
      };
      fetchUsersAndAdmins()
        fetchMessages();
        fetchSalesData();
    }, []);

  
    const usersAndAdminsData = {
      labels: ["Users", "Admins"],
      datasets: [
          {
              label: "Users vs Admins",
              data: [userCount, adminCount],
              backgroundColor: ["#2196f3", "#f44336"], 
          },
      ],
  };

    const barData = {
        labels: ["Unread Messages", "Total Messages"],
        datasets: [
            {
                label: "Inbox Stats",
                data: [unreadCount, messages.length],
                backgroundColor: ["#ff6384", "#36a2eb"],
            },
        ],
    };

    const doughnutData = {
        labels: ["Read", "Unread"],
        datasets: [
            {
                data: [messages.length - unreadCount, unreadCount],
                backgroundColor: ["#4caf50", "#ff9800"],
            },
        ],
    };

    const lineData = {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [
            {
                label: "Messages Received",
                data: [5, 10, 15, messages.length],
                borderColor: "#2196f3",
                fill: false,
            },
        ],
    };

    const salesDataChart = {
        labels: ["Last 2 Weeks", "This Week"],
        datasets: [
            {
                label: "Sales",
                data: salesData,
                backgroundColor: "#4caf50",
            },
        ],
    };

    const profitChartData = {
        labels: ["Last 2 Weeks", "This Week"],
        datasets: [
            {
                label: "Weekly Profit",
                data: weeklyProfit,
                backgroundColor: "#ff9800",
            },
        ],
    };

  

    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            <div className="bg-white p-4 shadow rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Inbox Overview</h2>
                <Bar data={barData} />
            </div>

            <div className="bg-white p-4 shadow rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Message Status</h2>
                <Doughnut data={doughnutData} />
            </div>

            <div className="bg-white p-4 shadow rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Messages Trend</h2>
                <Line data={lineData} />
            </div>

            <div className="bg-white p-4 shadow rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Sales Data</h2>
                <Bar data={salesDataChart} />
            </div>

            <div className="bg-white p-4 shadow rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Weekly Profit</h2>
                <Bar data={profitChartData} />
            </div>

            <div className="bg-white p-4 shadow rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Total Users</h2>
                <Line data={usersAndAdminsData} />
            </div>
        </div>
    );
}
