import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { homeService, HomeContent } from "../services/homeService";
import {
  ChevronRight,
  Activity,
  BarChart2,
  Briefcase,
  Brain,
} from "lucide-react";

interface HomeProps {
  colorMode: "light" | "dark";
}

function Home({ colorMode }: HomeProps) {
  const [content, setContent] = useState<HomeContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await homeService.getHomeContent();
        setContent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load content");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          colorMode === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          colorMode === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div
      className={`min-h-screen ${
        colorMode === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1
            className={`text-4xl md:text-5xl font-bold mb-6 ${
              colorMode === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {content.title}
          </h1>
          <p
            className={`text-xl mb-8 ${
              colorMode === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {content.subTitle}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/chart"
              className={`inline-flex items-center px-6 py-3 rounded-lg ${
                colorMode === "dark"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white font-semibold transition duration-300`}
            >
              <BarChart2 className="w-5 h-5 mr-2" />
              Start Trading
              <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
            <Link
              to="/strategy-builder"
              className={`inline-flex items-center px-6 py-3 rounded-lg ${
                colorMode === "dark"
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              } font-semibold transition duration-300`}
            >
              <Brain className="w-5 h-5 mr-2" />
              Build Strategy
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div
        className={`py-16 ${colorMode === "dark" ? "bg-gray-800" : "bg-white"}`}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg ${
                  colorMode === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-50 hover:bg-gray-100"
                } transition-colors duration-300`}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-2 rounded-lg ${
                      colorMode === "dark" ? "bg-gray-600" : "bg-gray-200"
                    }`}
                  >
                    {index % 4 === 0 ? (
                      <BarChart2 className="w-6 h-6" />
                    ) : index % 4 === 1 ? (
                      <Activity className="w-6 h-6" />
                    ) : index % 4 === 2 ? (
                      <Briefcase className="w-6 h-6" />
                    ) : (
                      <Brain className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3
                      className={`text-lg font-semibold mb-2 ${
                        colorMode === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {feature}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div
          className={`rounded-lg ${
            colorMode === "dark" ? "bg-gray-800" : "bg-white"
          } p-8 text-center shadow-lg`}
        >
          <h2
            className={`text-3xl font-bold mb-4 ${
              colorMode === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Ready to Start Trading?
          </h2>
          <p
            className={`text-lg mb-6 ${
              colorMode === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Join thousands of traders using our advanced platform
          </p>
          <Link
            to="/chart"
            className={`inline-flex items-center px-8 py-4 rounded-lg ${
              colorMode === "dark"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white font-semibold transition duration-300`}
          >
            Get Started
            <ChevronRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
