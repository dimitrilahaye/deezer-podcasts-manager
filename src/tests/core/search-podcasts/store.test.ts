import sinon from "sinon";
import createStore from "../../../core/search-podcasts/store";
import { sleep } from "../../utils";

function dependencies({
    search = sinon.stub(),
    toggle = sinon.stub(),
}: {
    search?: sinon.SinonStub;
    toggle?: sinon.SinonStub;
}) {
    return {
        podcastsService: {
            search,
        },
        podcastRepository: {
            toggleFromFavorites: toggle,
        },
    };
}

function getFakePodcast(data: { isFavorite: boolean }) {
    return {
        id: 1,
        title: "title",
        description: "description",
        available: true,
        picture: "picture",
        isFavorite: data.isFavorite,
    }
}

describe('Podcasts store', () => {
    beforeEach(() => {
        sinon.resetHistory()
    });
    afterEach(() => {
        sinon.resetHistory()
    });

    it('should have the correct state on start', () => {
        // When
        const useStore = createStore(dependencies({}));

        // Then
        expect(useStore.getState()).toMatchObject({
            podcasts: [],
            error: null,
            status: "idle",
        })
    });

    it('should reset store state after a reset', async () => {
        // Given
        const foundPodcasts = [getFakePodcast({ isFavorite: false })]
        const searchStub = sinon.stub().resolves(foundPodcasts)
        const useStore = createStore(dependencies({
            search: searchStub
        }));
        useStore.getState().searchPodcast('query')
        await sleep(100)
        expect(useStore.getState()).toMatchObject({
            podcasts: foundPodcasts,
            error: null,
            status: "success",
        })

        // When
        useStore.getState().reset()
        await sleep(100)

        // Then
        expect(useStore.getState()).toMatchObject({
            podcasts: [],
            error: null,
            status: "idle",
        })
    });

    describe('Search podcasts', () => {
        it('should have the loading state on search', async () => {
            // Given
            const foundPodcasts = [getFakePodcast({ isFavorite: false })]
            const searchStub = sinon.stub().resolves(foundPodcasts)
            const useStore = createStore(dependencies({
                search: searchStub
            }));

            // When
            useStore.getState().searchPodcast('query')

            // Then
            expect(useStore.getState().status).toBe('podcasts_loading')
        });

        it('should update podcasts list after a successful search', async () => {
            // Given
            const foundPodcasts = [getFakePodcast({ isFavorite: false })]
            const searchStub = sinon.stub().resolves(foundPodcasts)
            const useStore = createStore(dependencies({
                search: searchStub
            }));

            // When
            useStore.getState().searchPodcast('query')
            await sleep(100)

            // Then
            expect(searchStub.calledOnceWith('query')).toBe(true)
            expect(useStore.getState()).toMatchObject({
                podcasts: foundPodcasts
            })
        });

        it('should be on success state after a successful search', async () => {
            // Given
            const foundPodcasts = [getFakePodcast({ isFavorite: false })]
            const searchStub = sinon.stub().resolves(foundPodcasts)
            const useStore = createStore(dependencies({
                search: searchStub
            }));

            // When
            useStore.getState().searchPodcast('query')
            await sleep(100)

            // Then
            expect(useStore.getState().status).toBe('success')
        });

        it('should update error after a failed search', async () => {
            // Given
            const searchStub = sinon.stub().rejects(new Error('error'))
            const useStore = createStore(dependencies({
                search: searchStub
            }));

            // When
            useStore.getState().searchPodcast('query')
            await sleep(100)

            // Then
            expect(useStore.getState()).toMatchObject({
                error: 'error'
            })
        });

        it('should be on error state after a failed search', async () => {
            // Given
            const searchStub = sinon.stub().rejects(new Error('error'))
            const useStore = createStore(dependencies({
                search: searchStub
            }));

            // When
            useStore.getState().searchPodcast('query')
            await sleep(100)

            // Then
            expect(useStore.getState().status).toBe('error')
        });
    })

    describe('Toggle podcast from favorites', () => {
        it('should have the loading state on toggle', async () => {
            // Given
            const useStore = createStore(dependencies({}));

            // When
            useStore.getState().togglePodcastFromFavorites(getFakePodcast({ isFavorite: false }))

            // Then
            expect(useStore.getState().status).toBe('toggle_favorite_loading')
        });

        it('should update podcast after a successful toggle', async () => {
            // Given
            const returnedPodcast = getFakePodcast({ isFavorite: false })
            const toggleStub = sinon.stub().resolves({
                ...returnedPodcast,
                isFavorite: true
            })
            const useStore = createStore(dependencies({
                search: sinon.stub().resolves([returnedPodcast]),
                toggle: toggleStub
            }));

            // When
            useStore.getState().searchPodcast('query')
            await sleep(100)
            useStore.getState().togglePodcastFromFavorites(returnedPodcast)
            await sleep(100)

            // Then
            expect(toggleStub.calledOnceWith(returnedPodcast)).toBe(true)
            expect(useStore.getState()).toMatchObject({
                podcasts: [{
                    ...returnedPodcast,
                    isFavorite: true
                }]
            })
        });

        it('should be on success state after a successful toggle', async () => {
            // Given
            const returnedPodcast = getFakePodcast({ isFavorite: false })
            const toggleStub = sinon.stub().resolves({
                ...returnedPodcast,
                isFavorite: true
            })
            const useStore = createStore(dependencies({
                search: sinon.stub().resolves([returnedPodcast]),
                toggle: toggleStub
            }));

            // When
            useStore.getState().searchPodcast('query')
            await sleep(100)
            useStore.getState().togglePodcastFromFavorites(returnedPodcast)
            await sleep(100)

            // Then
            expect(useStore.getState().status).toBe('success')
        });

        it('should update error after a failed toggle', async () => {
            // Given
            const returnedPodcast = getFakePodcast({ isFavorite: false })
            const toggleStub = sinon.stub().rejects(new Error('error'))
            const useStore = createStore(dependencies({
                search: sinon.stub().resolves([returnedPodcast]),
                toggle: toggleStub
            }));

            // When
            useStore.getState().searchPodcast('query')
            await sleep(100)
            useStore.getState().togglePodcastFromFavorites(returnedPodcast)
            await sleep(100)

            // Then
            expect(useStore.getState()).toMatchObject({
                error: 'error'
            })
        });

        it('should be on error state after a failed toggle', async () => {
            // Given
            const returnedPodcast = getFakePodcast({ isFavorite: false })
            const toggleStub = sinon.stub().rejects(new Error('error'))
            const useStore = createStore(dependencies({
                search: sinon.stub().resolves([returnedPodcast]),
                toggle: toggleStub
            }));

            // When
            useStore.getState().searchPodcast('query')
            await sleep(100)
            useStore.getState().togglePodcastFromFavorites(returnedPodcast)
            await sleep(100)

            // Then
            expect(useStore.getState().status).toBe('error')
        });
    })
});