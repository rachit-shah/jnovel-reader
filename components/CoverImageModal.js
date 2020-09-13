export default {
    template: `
    <div 
        class="modal fixed w-full h-full top-0 left-0 flex items-center justify-center"
        :class="{'opacity-0': !open, 'pointer-events-none': !open}" 
        @click="$emit('close')"
    >
        <div class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
        <div class="modal-content" style="display:table-cell; vertical-align:middle; text-align:center; z-index:11; width:100%; height:100%;">
            <div class="flex justify-between items-center pb-3" style="margin-left:36%; margin-top:1%;">
                <div class="modal-close cursor-pointer z-50" @click="$emit('close')">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="25px" height="25px"><path d="M0 0h24v24H0z" fill="none"/><path d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                </div>
            </div>
            <img v-bind:src="coverImageUrl" style="height:80%; margin-left:36%;">
            <div id="caption" class="text-2xl font-bold text-gray-300" style="left:36%;">{{captionText}}</div>
        </div>
    </div>
    `,
    data() {
        return {};
    },
    props: ['open','coverImageUrl', 'captionText'],
    methods: {
    }
}
