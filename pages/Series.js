import Serie from "../components/Serie.js"
import SignInForm from "../components/SignInForm.js"

export default {
    template: `
    <div class="container mx-auto py-3 text-gray-700">
        <div class="border-b-2 border-blue-700 flex justify-start items-baseline mb-4">
            <h1 class="text-2xl px-2 sm:mr-10">Series</h1>
            <router-link to="/series/all" class="border-b-4 hover:border-blue-700 px-2 sm:mr-10" :class="{'border-transparent': !isFilteredAll, 'border-blue-700': isFilteredAll}">
                All
            </router-link>
            <router-link to="/series/reading-list" class="border-b-4 hover:border-blue-700 px-2 sm:mr-10" :class="{'border-transparent': !isFilteredReadingList, 'border-blue-700': isFilteredReadingList}">
                Reading&nbsp;list
            </router-link>
            <div class="w-full flex-1"></div>
            <input v-model="search" class="flex-shrink min-w-0 shadow appearance-none border rounded py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2" id="series-search" type="text" placeholder="Search">
        </div>
        
        <sign-in-form v-show="showSignInForm" @signed-in="loadReadingList" class="mt-4 flex-1"></sign-in-form>
         
        <div  v-show="!showSignInForm" class="flex content-center flex-wrap">
            <serie v-for="serie in filteredSeries" v-bind:key="serie.id" :serie="serie"></serie>
        </div>
    </div>
  `,
    data() {
        return {
            filter: 'all',
            search: ''
        }
    },
    async created() {
        this.filter = this.$route.params.filter || this.$root.sharedStore.preferredFilter;
        this.$root.sharedStore.hideAlert();
        this.$root.noSleep.disable();
        console.log('NoSleep disabled');
    },
    watch: {
        $route(to, _from) {
            this.filter = this.$root.handleFilterChange(to.params.filter);
        }
    },
    computed: {
        showSignInForm() {
            return this.filter === 'reading-list' && !this.$root.isUserAuthValid;
        },
        isFilteredAll() {
            return this.filter === 'all';
        },
        isFilteredReadingList() {
            return this.filter === 'reading-list';
        },
        filteredSeries() {
            let filteredSeries = [];
            if(this.isFilteredAll) {
                filteredSeries = this.$root.sharedStore.series;
            } else if(this.isFilteredReadingList) {
                filteredSeries = this.$root.sharedStore.series.filter((serie) => this.$root.readingList.isReadingSerie(serie));
            }

            if(this.search && this.search.length > 0) {
                filteredSeries = this.$root.fuseSearchFilter(filteredSeries, this.search);
            }

            return filteredSeries;
        }
    },
    methods: {
        loadReadingList() {
            this.$root.loadUserDetails();
        }
    },
    components: {
        Serie, SignInForm
    }
}
