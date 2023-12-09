import UIVisualElement from './UIVisualElement.js'

export default class S5Button extends UIVisualElement
{
	constructor()
	{
		super();
		
		this.DomEvents = {};
	}
	
	
	connectedCallback()
	{
		super.connectedCallback();

		this.innerText = 'S5 Button';

		//	refresh attributes
		this.attributeChangedCallback();
		this.attributeChangedCallback('label',null,this.getAttribute('label'));
	}
	
	static get observedAttributes()
	{
		return ['label'];
	}
	
	attributeChangedCallback(name, oldValue, newValue)
	{
		if ( name == 'label' )
		{
			const Element = this;
			if ( Element )
				Element.innerText = newValue;
		}
	}

}

//	name requires dash!
window.customElements.define( 'studio5ui-s5button', S5Button );
