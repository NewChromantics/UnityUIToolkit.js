export default class UILabel extends HTMLElement
{
	constructor()
	{
		super();
		
		this.DomEvents = {};
	}
	
	CreateStyle()
	{
		const Style = document.createElement('style');
		Style.textContent = `:root { display:flex; }`;
		this.Shadow.appendChild(Style);
		//this.Style.textContent = Css ? `@import "${Css}";` : '';
	}
	
	connectedCallback()
	{
		//	create a shadow dom
		this.Shadow = this.attachShadow({mode: 'open'});
		//	slot in the light dom (original inner html)
		this.Shadow.innerHTML = '<slot></slot>';

		const Label = document.createElement('label');
		Label.style.background = 'blue';
		Label.innerText = 'Label';
		
		this.Shadow.appendChild(Label);
		this.CreateStyle();

		//	refresh attributes
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
			const Element = this.Shadow?.querySelector('label');
			if ( Element )
				Element.innerText = newValue;
		}
	}

}

//	name requires dash!
window.customElements.define( 'ui-label', UILabel );
