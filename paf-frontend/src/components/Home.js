import React from 'react';
import { Sprout, Leaf, BarChart, ClipboardList, ShieldCheck, TrendingUp } from 'lucide-react';

const FirstHome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-green-800">
              Smart Fertilizer Management
            </h1>
            <p className="text-xl text-green-700 leading-relaxed">
              Optimize your crop nutrition with precision farming technology. 
              Maximize yields, reduce costs, and promote sustainable agriculture.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
                Get Started
              </button>
              <button className="border-2 border-green-600 text-green-700 px-6 py-3 rounded-lg hover:bg-green-100 transition">
                Learn More
              </button>
            </div>
          </div>

          <div className="hidden md:block">
  <img 
    src="/images/farming-landscape.jpg" // Use the actual path to your image
    alt="Farming landscape" 
    className="rounded-xl shadow-xl"
  />
</div>

        </div>


        <hr className="my-8 border-t-2 border-green-600" />  {/* Customize thickness and color */}
        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[ 
              {
                icon: <Sprout className="w-12 h-12 text-green-600" />,
                title: "Crop Nutrition",
                description: "Tailored fertilizer recommendations based on soil analysis and crop needs."
              },
              {
                icon: <Leaf className="w-12 h-12 text-green-600" />,
                title: "Sustainable Farming",
                description: "Reduce environmental impact while improving agricultural productivity."
              },
              {
                icon: <BarChart className="w-12 h-12 text-green-600" />,
                title: "Data Insights",
                description: "Real-time analytics and performance tracking for your farming operations."
              },
              {
                icon: <ClipboardList className="w-12 h-12 text-green-600" />,
                title: "Inventory Management",
                description: "Track and manage fertilizer stocks efficiently."
              },
              {
                icon: <ShieldCheck className="w-12 h-12 text-green-600" />,
                title: "Risk Management",
                description: "Proactive monitoring and alerts for crop health and potential issues."
              },
              {
                icon: <TrendingUp className="w-12 h-12 text-green-600" />,
                title: "Yield Optimization",
                description: "Strategies to maximize crop yield and agricultural efficiency."
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition text-center h-full"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-green-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-green-700">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <hr className="my-8 border-t-2 border-green-600" />  {/* Customize thickness and color */}

       {/* About Section */}
<div className="mt-16 grid md:grid-cols-2 gap-8 items-center">
  <div className="order-2 md:order-1">
    <img 
      src="/images/farming-landscape.jpg"
      alt="About Us"
      className="rounded-xl shadow-xl"
    />
  </div>

  <div className="order-1 md:order-2 space-y-4 text-center md:text-left">
    <h3 className="text-3xl font-bold text-green-800">
      About Us
    </h3>
    <p className="text-lg text-green-700 leading-relaxed">
      We are dedicated to providing the best fertilizer management solutions for farmers 
      around the world. Our goal is to optimize crop production while promoting sustainable farming practices.
    </p>
    <p className="text-lg text-green-700 leading-relaxed">
      With cutting-edge technology and data-driven insights, we aim to revolutionize the farming industry, 
      ensuring better yields, less waste, and a healthier environment.
    </p>
  </div>
</div>

      </div>
    </div>
  );
};

export default FirstHome;
