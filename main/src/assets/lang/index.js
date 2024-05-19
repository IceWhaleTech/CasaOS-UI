const files = require.context("./", false, /\.json$/);
let langs = {};
files.keys().forEach((key) => {
	langs[key.replace(/(\.\/|\.json$)/g, "").toLowerCase()] = files(key);
});

export default langs;
