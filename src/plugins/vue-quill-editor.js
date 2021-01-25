import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// import something here
import VueQuillEditor, { Quill } from 'vue-quill-editor'
// leave the export, even if you don't use it

import { ImageDrop } from 'quill-image-drop-module'
import ImageResize from 'quill-image-resize-module'

console.log(ImageResize)

Quill.register('modules/imageDrop', ImageDrop)
// Quill.register('modules/imageResize', ImageResize)

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }], // custom button values
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
  [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
  [{ 'direction': 'rtl' }], // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],
  [{ 'align': [] }],
  [ 'image' ],
  [ 'video' ],

  ['clean'] // remove formatting button
]

export default ({ app, router, Vue }) => {
  // something to do
  Vue.use(VueQuillEditor, {
    modules: {
      imageDrop: true,
      imageResize: {},
      toolbar: toolbarOptions
    }
  })
}
