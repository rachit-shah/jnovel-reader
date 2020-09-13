import SerieDetailRow from "../components/SerieDetailRow.js"
import SeriePartList from "../components/SeriePartList.js"
import CoverImageModal from "../components/CoverImageModal.js"

export default {
    template: `
    <div style="background-clip: content-box" class="relative w-full lg:w-1/3 flex-grow p-2 mb-4 bg-blue-200">
        <div class="text-gray-700 text-xs w-full pb-12">
            <div class="h-24 flex flex-wrap items-center bg-blue-300 px-2 w-full">
                <strong class="w-full text-center text-base">
                    <span class="bg-yellow-500 rounded mr-2 px-2 py-1 font-semibold" v-show="isReading">Reading</span>
                    {{serie.title}}
                </strong>
                <span class="w-full text-center text-xxs">
                    ({{serie.titleShort}} / {{serie.titleOriginal}})
                </span>
            </div>
            <div class="flex items-start">
                <div class="w-1/3">
                    <img :src="coverImageUrl" class="w-full mb-2 series-cover-image-small" @click="showFullCoverImage=true"/>
                    <serie-detail-row key-name="Author" :value="serie.author"></serie-detail-row>
                    <serie-detail-row key-name="Illustrator" :value="serie.illustrator"></serie-detail-row>
                    <serie-detail-row key-name="Translator" :value="serie.translator"></serie-detail-row>
                    <serie-detail-row key-name="Editor" :value="serie.editor"></serie-detail-row>
                </div>
                <p class="p-2 flex-grow w-2/3">
                    {{serie.description}}
                    <strong class="block mt-2 font-semibold">
                        {{serie.tags}}
                    </strong>
                </p>
            </div>
            <cover-image-modal style="z-index:10" :open="showFullCoverImage" :coverImageUrl="coverImageUrl" :captionText="serie.title" @close="showFullCoverImage=false"></cover-image-modal>
            <serie-part-list style="z-index:10" :open="showPartList" :volumes="volumes" @close="showPartList=false"></serie-part-list>
            <div style="background-clip: content-box" class="h-12 bg-blue-300 px-2 w-full absolute bottom-0 left-0 flex items-center">
                <div 
                    class="text-black-100 hover:text-white cursor-pointer mr-2" 
                    style="position:absolute; float:left; top: 22%; left: 1.5em; width:15%;" 
                    @click="showPartList = true"
                >
                    <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                        <title>Part List</title>
                        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
                    </svg>
                </div>
                <div style="position:absolute; float:right; right:0.8em; width:85%;" class="justify-end">
                    <router-link style="display: inline-block; max-width:7.15em; font-size:1.1em; text-overflow: ellipsis; white-space: nowrap; float: right;" v-show="latestUnreadPart && isReading" :to="linkToLatestUnreadPart" class="bg-blue-400 hover:bg-transparent text-gray-700 font-semibold hover:text-gray-800 py-2 px-3 border border-blue-300 hover:border-blue-500 rounded mr-2 text-center">
                        Continue Reading
                    </router-link>
                    <router-link style="display: inline-block; max-width:7.15em; font-size:1.1em; white-space: nowrap; float: right;" v-show="latestPart" :to="linkToLatestPart" class="bg-blue-400 hover:bg-transparent text-gray-700 font-semibold hover:text-gray-800 py-2 px-3 border border-blue-300 hover:border-blue-500 rounded mr-2 text-center">
                        Latest Part
                    </router-link>
                    <router-link style="display: inline-block; max-width:7.15em; font-size:1.1em; white-space: nowrap; float: right;" v-show="firstPart && !isReading" :to="linkToFirstPart" class="bg-blue-400 hover:bg-transparent text-gray-700 font-semibold hover:text-gray-800 py-2 px-3 border border-blue-300 hover:border-blue-500 rounded mr-2 text-center">
                        First Part
                    </router-link>
                    <router-link style="display: inline-block; max-width:7.15em; font-size:1.1em; white-space: nowrap; float: right;" v-show="showPreview" :to="linkToPreview" class="bg-blue-400 hover:bg-transparent text-gray-700 font-semibold hover:text-gray-800 py-2 px-3 border border-blue-300 hover:border-blue-500 rounded mr-2 text-center">
                        Preview
                    </router-link>
                </div>
            </div>
        </div>
        </div>
  `,
    data() {
        return {
            showPartList: false,
            showFullCoverImage: false,
            volumes: []
        }
    },
    created() {
        this.initPart();
    },
    props: ['serie'],
    components: {
        SerieDetailRow, SeriePartList, CoverImageModal
    },
    computed: {
        firstPart() {
            let parts = this.$root.sharedStore.feed.filter(part => part.serieId === this.serie.id);
            parts.sort((partA, partB) => partA.partNumber - partB.partNumber);
            return parts[0];
        },
        latestPart() {
            let parts = this.$root.sharedStore.feed.filter(part => part.serieId === this.serie.id && !part.preview);
            parts.sort((partA, partB) => partB.partNumber - partA.partNumber);
            return parts[0];
        },
        latestUnreadPart() {
            let parts = this.$root.sharedStore.feed.filter(part => part.serieId === this.serie.id);
            let readParts = parts.filter(part => this.$root.readingList.hasReadPart(part));
            parts.sort((partA, partB) => partB.partNumber - partA.partNumber);
            let latestReadPart = parts[0];
            let unreadParts = parts.filter(part => part.partNumber > latestReadPart.partNumber);
            unreadParts.sort((partA, partB) => partA.partNumber - partB.partNumber);
            return unreadParts[0];
        },
        linkToFirstPart() {
            return '/series/' + this.serie.id + '/part/' + (this.firstPart && this.firstPart.id);
        },
        linkToLatestPart() {
            return '/series/' + this.serie.id + '/part/' +  (this.latestPart && this.latestPart.id);
        },
        linkToLatestUnreadPart() {
            return '/series/' + this.serie.id + '/part/' +  (this.latestUnreadPart && this.latestUnreadPart.id);
        },
        coverImageUrl() {
            let attachments = this.serie.attachments;
            attachments.sort((attachA, attachB) => attachB.size - attachA.size);
            return 'https://d2dq7ifhe7bu0f.cloudfront.net/' + attachments[0].fullpath;
        },
        isReading() {
            return this.$root.readingList.readSeries[this.serie.id] && this.$root.readingList.readSeries[this.serie.id].max > 0.1;
        },
        showPreview() {
            if(!this.firstPart) return true;

            return this.firstPart.partNumber > 1;
        },
        linkToPreview() {
            return '/series/' + this.serie.id + '/part/preview';
        }
    },
    methods: {
        async initPart() {
            this.showPartList = false;
            this.showFullCoverImage = false;
            //this.$root.sharedStore.hideAlert();
            this.volumes = await this.loadVolumes();
            //window.scrollTo(0, 0);
        },

        async loadVolumes() {
            let partsResponse = await this.$root.api.loadSerieParts(this.serie.id);
            return partsResponse.data;
        }
    }
}
