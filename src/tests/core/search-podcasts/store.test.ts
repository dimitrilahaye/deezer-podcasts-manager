import sinon from "sinon";
import createStore from "../../../core/search-podcasts/store";
import { sleep } from "../../utils";
import { fakePodcast, mockDependencies } from "@index/tests/mocks";

describe('Podcasts store', () => {
    beforeEach(() => {
        sinon.resetHistory()
    });
    afterEach(() => {
        sinon.resetHistory()
    });

    it('should have the correct default state on start', () => {
        // When
        const useStore = createStore(mockDependencies({}));

        // Then
        expect(useStore.getState()).toMatchObject({
            podcasts: [],
            error: null,
            status: "idle",
        })
    });

    it('should reset store state after a reset', async () => {
        // Given
        const foundPodcasts = [fakePodcast({ isFavorite: false })]
        const searchStub = sinon.stub().resolves(foundPodcasts)
        const useStore = createStore(mockDependencies({
            search: searchStub
        }));
        useStore.getState().searchPodcast('query')
        await sleep(100)
        expect(useStore.getState()).toMatchObject({
            podcasts: foundPodcasts,
            error: null,
            status: "success_search",
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
            const foundPodcasts = [fakePodcast({ isFavorite: false })]
            const searchStub = sinon.stub().resolves(foundPodcasts)
            const useStore = createStore(mockDependencies({
                search: searchStub
            }));

            // When
            useStore.getState().searchPodcast('query')

            // Then
            expect(useStore.getState().status).toBe('podcasts_loading')
        });

        it('should update podcasts list after a successful search', async () => {
            // Given
            const foundPodcasts = [fakePodcast({ isFavorite: false })]
            const searchStub = sinon.stub().resolves(foundPodcasts)
            const useStore = createStore(mockDependencies({
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
            const foundPodcasts = [fakePodcast({ isFavorite: false })]
            const searchStub = sinon.stub().resolves(foundPodcasts)
            const useStore = createStore(mockDependencies({
                search: searchStub
            }));

            // When
            useStore.getState().searchPodcast('query')
            await sleep(100)

            // Then
            expect(useStore.getState().status).toBe('success_search')
        });

        it('should update error after a failed search', async () => {
            // Given
            const searchStub = sinon.stub().rejects(new Error('error'))
            const useStore = createStore(mockDependencies({
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
            const useStore = createStore(mockDependencies({
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
            const useStore = createStore(mockDependencies({}));

            // When
            useStore.getState().togglePodcastFromFavorites(fakePodcast({ isFavorite: false }))

            // Then
            expect(useStore.getState().status).toBe('toggle_favorite_loading')
        });

        it('should update podcast after a successful toggle', async () => {
            // Given
            const returnedPodcast = fakePodcast({ isFavorite: false })
            const toggleStub = sinon.stub().resolves({
                ...returnedPodcast,
                isFavorite: true
            })
            const useStore = createStore(mockDependencies({
                search: sinon.stub().resolves([returnedPodcast]),
                toggleFromFavorites: toggleStub
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
            const returnedPodcast = fakePodcast({ isFavorite: false })
            const toggleStub = sinon.stub().resolves({
                ...returnedPodcast,
                isFavorite: true
            })
            const useStore = createStore(mockDependencies({
                search: sinon.stub().resolves([returnedPodcast]),
                toggleFromFavorites: toggleStub
            }));

            // When
            useStore.getState().searchPodcast('query')
            await sleep(100)
            useStore.getState().togglePodcastFromFavorites(returnedPodcast)
            await sleep(100)

            // Then
            expect(useStore.getState().status).toBe('success_toggle')
        });

        it('should update error after a failed toggle', async () => {
            // Given
            const returnedPodcast = fakePodcast({ isFavorite: false })
            const toggleStub = sinon.stub().rejects(new Error('error'))
            const useStore = createStore(mockDependencies({
                search: sinon.stub().resolves([returnedPodcast]),
                toggleFromFavorites: toggleStub
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
            const returnedPodcast = fakePodcast({ isFavorite: false })
            const toggleStub = sinon.stub().rejects(new Error('error'))
            const useStore = createStore(mockDependencies({
                search: sinon.stub().resolves([returnedPodcast]),
                toggleFromFavorites: toggleStub
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

    describe('Get podcast by id', () => {
        it('should return the podcast with given id', async () => {
            // Given
            const foundPodcast = fakePodcast({ isFavorite: false })
            const searchStub = sinon.stub().resolves([foundPodcast])
            const useStore = createStore(mockDependencies({
                search: searchStub
            }));
            useStore.getState().searchPodcast('query')
            await sleep(100)

            // When
            const podcast = useStore.getState().getPodcast(foundPodcast.id)

            // Then
            expect(podcast).toStrictEqual(foundPodcast)
        });

        it('should return the undefined if podcast does not exist', async () => {
            // Given
            const foundPodcast = fakePodcast({ isFavorite: false })
            const searchStub = sinon.stub().resolves([foundPodcast])
            const useStore = createStore(mockDependencies({
                search: searchStub
            }));
            useStore.getState().searchPodcast('query')
            await sleep(100)

            // When
            const podcast = useStore.getState().getPodcast(456)

            // Then
            expect(podcast).toBeUndefined()
        });
    })
});