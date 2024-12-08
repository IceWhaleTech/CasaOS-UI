const files = require.context("./", false, /\.json$/);
const langs = {};
files.keys().forEach((key) => {
	langs[key.replace(/(\.\/|\.json$)/g, "").toLowerCase()] = files(key);
});

export default langs;
