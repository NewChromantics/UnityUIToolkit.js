import UIVisualElement from './UIVisualElement.js'


//	these classes are in UI builder, but not in the doc
//	can't find any explanation, so in unity's default theme uss? (which is hidden)
//	but viewing MatchingSelectors in UI builder maybe reveals them
const unity_label_css = `
	flex:		0 0 auto;
	text-align:	center;
	margin-top:	0;
	padding-left:	1px;
	padding-right:	2px;
	white-space:	nowrap;
`;
const unity_label_css2 = `
	flex:		0 0 auto;
	margin:		4px 4px 2px 2px;
	padding-left:	1px;
	padding-top:	4px;
	padding-right:	2px;
	padding-bottom:	4px;
	white-space:	nowrap;
`;

//	I think these are defaults in ui builder
const Label_css = `
	margin:		0;
	padding:	0;

	text-overflow:	clip;
	text-wrap:	wrap;	/* "normal" in ui builder =... wrap? */
`;

export default class UILabel extends UIVisualElement
{
	constructor()
	{
		super();
		
		this.DomEvents = {};
	}
	
	connectedCallback()
	{
		this.innerText=  'label contents...';
		//this.style.display = 'flex';	//	unity assumes this by default
		
		//	.unity-label
		//	.unity-text-element
		//	gr: not sure what order these should be in
		this.style.cssText += unity_label_css;
		this.style.cssText += unity_label_css2;
		this.style.cssText += Label_css;
		
		//	refresh attributes
		this.attributeChangedCallback();
		this.attributeChangedCallback('text',null,this.getAttribute('text'));
	}
	
	static get observedAttributes()
	{
		return ['text'];
	}
	
	attributeChangedCallback(name, oldValue, newValue)
	{
		if ( name == 'text' )
		{
			const Element = this;
			if ( Element )
				Element.innerText = newValue;
		}
	}

}

//	name requires dash!
window.customElements.define( 'ui-label', UILabel );
