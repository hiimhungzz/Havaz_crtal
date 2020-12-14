import React from 'react';
import ReactQuill, { Quill} from 'react-quill';
//  csss
import "./styles.scss";
import 'react-quill/dist/quill.snow.css';
// var quillEditor = new Quill('.ql-editor', {
// });
// quillEditor.spellcheck = false;
class Editor extends React.Component {
	// componentWillReceiveProps() {
	// 	this.reactQuillRef.spellcheck=false;
	// }
    render () {
		const {html, handleChange} = this.props;
		return (
			<div>
				<ReactQuill
					ref={(el) => {
						this.reactQuillRef = el }}
					theme={"snow"}
					spellcheck={false}
					onChange={handleChange}
					value={html}
					modules={Editor.modules}
					formats={Editor.formats}
					bounds={'.app'}
					placeholder={"Nhập nội dung ... "}
				/>
			</div>
		)
    }
}

Editor.modules = {
	toolbar: [
		[{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
		[{size: []}],
		['bold', 'italic', 'underline'],
		[{'list': 'ordered'}, {'list': 'bullet'},
		{'indent': '-1'}, {'indent': '+1'}],
],
	clipboard: {
		matchVisual: false,
	}
}

Editor.formats = [
	'header', 'font', 'size',
	'bold', 'italic', 'underline',
	'list', 'bullet', 'indent',
]

export default Editor;