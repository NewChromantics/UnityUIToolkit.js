import UIVisualElement from './UIVisualElement.js'

//	gr: this is :root in the css, but isnt being applied
//		it should be on the root node, which is not ui-uxml
//		but <style> tags should also go into that (which are under here)
const Root_css = `
	display: flex;
	padding: 48px;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 40px;
	background-color: rgba(0, 0, 0, 0.96);
`;


export default class UIRoot extends UIVisualElement
{
	constructor()
	{
		super();
	}
	
	connectedCallback()
	{
		this.style.cssText += Root_css;

		this.attributeChangedCallback();
	}
	
	attributeChangedCallback(name, oldValue, newValue)
	{
	}
}

//	name requires dash!
window.customElements.define( 'ui-uxml', UIRoot );
