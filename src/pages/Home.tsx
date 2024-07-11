import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { db } from '../../firebase/config';
import { collection, getDocs } from "firebase/firestore";
import 'tailwindcss/tailwind.css';

Chart.register(ArcElement, Tooltip, Legend);

const Home: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const categoryCounts: { [key: string]: number } = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const category = data.category;

        if (category) {
          if (categoryCounts[category]) {
            categoryCounts[category]++;
          } else {
            categoryCounts[category] = 1;
          }
        }
      });

      const categories = Object.keys(categoryCounts);
      const counts = Object.values(categoryCounts);

      setChartData({
        labels: categories,
        datasets: [
          {
            label: '# of Votes',
            data: counts,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 1,
          },
        ],
      });
    };

    fetchData();
  }, []);

  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="w-[600px]">
        <Pie data={chartData} />
      </div>
    </div>
  );
};

export default Home;
