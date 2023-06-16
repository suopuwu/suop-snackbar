# Material Snackbar

This is a single js file you drop into a webpage to use material snackbars.

Works on mobile and desktop

The snackbar has four properties:
|key|data type|
|--|--|
|text|string|
|lifespan|number|
|noCloseButton|boolean|
|actions|array of objects|

An action is an object that has  three properties
|key|data type|
|--|--|
|text|string|
|color|string formatted like '#000000'|
|onClick|function|

## Usage
To install it, just drop mSnackbar.js into your project and run suopSnackbar.init() in your js before usage.

#### Add a snackbar, with all options used
```
suopSnackbar.add({
	text: 'example text',
	lifespan: 5000, //this is in miliseconds
	actions: [
		new SuopSnackbarAction()
	],
	noCloseButton: false
});
```
#### Add a snackbar with infinite duration
```
suopSnackbar.add({text: 'example text', lifespan: Infinity});
```
#### List snackbars in use
```
console.log(suopSnackbar.list());
```
Would output
```
{
	mSnackbar0: SnackBar
	//and so on
}
```
#### Close a snackbar
The 'I am good at planning' method
```
var example = suopSnackbar.add({text: 'example text', lifespan: Infinity});
example.close();
```
The 'I forgot to plan and my program will break after it runs once' method
```
suopSnackbar.add({text: 'example text', lifespan: Infinity});
suopSnackbar.list().mSnackbar0.close();
```
Using the second method as it is written is not recommended, because it will only close the snackbar the first time a snackbar is added to the page. This is because each new snackbar is assigned a session unique id like mSnackbar0 and so on.

The 'I am not good at planning, but I know how this library works' method
```
for(snackbar in $.mSnackbar.list()) {
	suopSnackbar.list()[snackbar].close();
	break;
}
```
#### Change the text in a snackbar
```
var example = $.mSnackbar.add({text: 'example text', lifespan: Infinity});
example.text = example.text + 'text to be appended';
```
