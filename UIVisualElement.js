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

function GetBackgroundTint_Css(BackgroundSize,BackgroundImage)
{
	BackgroundSize = BackgroundSize || 'initial';	//	needs to match the background's scaling in order to align
	return `
		background-color: var(--unity-background-image-tint-color);
		background-blend-mode: multiply;
		-webkit-mask-size: ${BackgroundSize};
		-webkit-mask-image: ${BackgroundImage};
		xmask-image:${BackgroundImage};
		mask-type: alpha;
	`;
}

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

		//	apply style to calculate, otherwise we have no way to get background size if it comes from defaults
		this.style.cssText = Css;

		if ( this.style.cssText.includes('-unity-background-image-tint-color') )
		{
			const BackgroundSize = this.style.backgroundSize;
			const BackgroundImage = this.style.backgroundImage;
			const BackgroundCss = GetBackgroundTint_Css( BackgroundSize, BackgroundImage);
			this.style.cssText += BackgroundCss;
		}


		this.attributeChangedCallback('style',null,this.style.cssText);
	}
	
	attributeChangedCallback(name, oldValue, newValue)
	{
		if ( name == 'style' )
		{
		}
	}

}

//	name requires dash!
window.customElements.define( 'ui-visualelement', UIVisualElement );
