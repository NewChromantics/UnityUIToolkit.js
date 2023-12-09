//	defaults in unity
const VisualElement_css = `
 xflex:				0 initial;
xflex:				1 initial;
	display:			flex;
	flex-direction:		column;
	flex-basis:		auto;
	flex-wrap:			nowrap;
	background-size:	cover;
`;

export default class UIVisualElement extends HTMLElement
{
	constructor()
	{
		super();
		
		this.DomEvents = {};
	}
	
	
	connectedCallback()
	{
		//	insert defaults first (todo: via stylesheet!)
		let Css = ``;
		Css += VisualElement_css;
		Css += ` `;
		Css += this.style.cssText;
		this.style.cssText = Css;

		this.attributeChangedCallback();
	}
	
	attributeChangedCallback(name, oldValue, newValue)
	{
	}

}

//	name requires dash!
window.customElements.define( 'ui-visualelement', UIVisualElement );
