import SignInForm from "../components/SignInForm.js"

export default {
    template: `
    <div class="container mx-auto pt-3 text-gray-700">
        <h1 class="text-2xl px-2 border-b-2 border-blue-700">{{part.title}}</h1>
        
        <sign-in-form v-show="showSignInForm" @signed-in="loadPartData" class="mt-4"></sign-in-form>
        
        <div v-html="partData" id="part-data" class="px-2 py-4 bg-white"></div>
        
        <footer class="w-full sticky bottom-0">
            <div 
                class="bg-blue-700 p-4 flex" 
                :class="{'opacity-0': !showFooter}" 
                @mouseover="showFooter = true" 
                @mouseleave="showFooter = false"
                style="transition-property: opacity; transition-duration: 200ms"
            >
                <router-link 
                    v-show="previousPartId !== undefined" 
                    :to="'/series/' + part.serieId + '/part/' + previousPartId" 
                    class="flex-shrink text-left block lg:inline-block lg:mt-0 text-blue-200 hover:text-white"
                >
                    < Previous Part 
                </router-link>
                <div class="flex-grow">&nbsp;</div>
                <router-link 
                    v-show="nextPartId !== undefined" 
                    :to="'/series/' + part.serieId + '/part/' + nextPartId" 
                    class="flex-shrink text-right block lg:inline-block lg:mt-0 text-blue-200 hover:text-white"
                >
                    Next Part > 
                </router-link>
            </div>
            <div class="w-full bg-white" style="height: 5px">
                <div class="bg-blue-700 h-full" :style="{width: (100 * progress) + '%'}"></div>
            </div>
        </footer>
    </div>
  `,
    data() {
        return {
            partId: null,
            part: {},
            partData: "",
            showSignInForm: false,
            showFooter: true,
            progress: 0,
            volumes: []
        }
    },
    created() {
        this.initPart();
    },
    mounted() {
        window.addEventListener('scroll', () => {
            let scrollPos = window.scrollY;
            let winHeight = window.innerHeight;
            let docHeight = document.documentElement.scrollHeight;
            this.progress = scrollPos / (docHeight - winHeight);
            this.showFooter = this.progress > 0.99;
        })
    },
    watch: {
        $route(to, _from) {
            this.initPart();
        }
    },
    computed: {
        sortedSerieParts() {
            return this.volumes.map(volume => volume.parts).flat().filter(part => !part.expired);
        },

        nextPartId() {
            let nextPart = (this.sortedSerieParts || []).filter(part => part.partNumber - 1 === this.part.partNumber)[0];
            console.log(nextPart, nextPart && nextPart.id);
            return nextPart && nextPart.id;
        },

        previousPartId() {
            let previousPart = (this.sortedSerieParts || []).filter(part => part.partNumber + 1 === this.part.partNumber)[0];
            console.log(previousPart, previousPart && previousPart.id);
            return  previousPart && previousPart.id;
        }
    },
    methods: {
        async initPart() {
            this.$root.sharedStore.hideAlert();
            this.volumes = await this.loadVolumes();

            let partId = this.$route.params.id;
            if(partId === "latest") {
                this.part = await this.findLatestPart();
                this.partId = this.part.id;
            } else {
                let partResponse = await this.$root.api.loadPart(this.$route.params.id);
                this.part = partResponse.data;
                this.partId = this.part.id;
            }

            try {
                await this.loadPartData();
            } catch(error) {
                if(error.response.data.error.message === 'You cannot access this content') {
                    this.$root.sharedStore.setAlert('You must sign in to access this part');
                }
                this.showSignInForm = true;
            }
            window.scrollTo(0, 0);
        },

        async loadVolumes() {
            let partsResponse = await this.$root.api.loadSerieParts(this.$route.params.serieId);
            console.log(partsResponse.data);
            return partsResponse.data;
        },

        async findLatestPart() {
            this.volumes.sort((volumeA, volumeB) => volumeB.volumeNumber - volumeA.volumeNumber);
            let parts = this.volumes[0].parts;
            parts.sort((partA, partB) => partB.partNumber - partA.partNumber);
            return parts[0];
        },

        async loadPartData() {
            let partDataResponse = await this.$root.api.loadPartData(this.partId);
            this.partData = partDataResponse.data.dataHTML;

            this.$root.sharedStore.hideAlert();
            this.showSignInForm = false;
        }
    },
    components: {
        SignInForm
    }
}
