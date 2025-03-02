import type { ApiService } from "../../core/ports/api-service";

export class DataService implements ApiService {
  async fetchData(): Promise<string> {
    const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
    const json = await response.json();
    return json.name;
  }
}
