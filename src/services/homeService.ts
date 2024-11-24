import { apiService } from "./apiService";

export interface HomeContent {
  title: string;
  subTitle: string;
  features: string[];
}

class HomeService {
  async getHomeContent(): Promise<HomeContent> {
    try {
      return await apiService.get<HomeContent>("/home");
    } catch (error) {
      console.error("Error fetching home content:", error);
      throw new Error("Failed to fetch home content");
    }
  }
}

export const homeService = new HomeService();
