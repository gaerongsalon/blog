const modules = {
  toolbar: {
    container: [
      ["bold", "italic", "underline", "strike", "blockquote"],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: "ordered" }, { list: "bullet" }],
      // [{ script: "sub" }, { script: "super" }], // superscript/subscript
      // [{ indent: "-1" }, { indent: "+1" }], // outdent/indent

      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      // [{ header: [1, 2, 3, /*4, 5, 6,*/ false] }],

      [{ color: [] }, { background: [] }, { align: [] }],

      ["link", "video"],
      ["clean"], // remove formatting button
    ],
  },
  clipboard: { matchVisual: false },
};

export default modules;
