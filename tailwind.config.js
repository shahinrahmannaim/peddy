module.exports = {
	content: [
		"./public/**/*.html", // Include all HTML files in the `public` folder
		"./public/**/*.js", // Include all JS files in the `public` folder
	],
	theme: {
		extend: {},
	},
	plugins: [require("daisyui")],
};
