export default interface PodcastsService {
    search(name: string): Promise<string>
}