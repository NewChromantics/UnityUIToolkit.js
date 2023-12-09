export default class S5Button extends HTMLElement
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
		this.Shadow.style.display = 'flex';

		const Button = document.createElement('button');
		Button.innerText = 'S5 Button';
		
		this.Shadow.appendChild(Button);
		this.CreateStyle();
		
		this.attributeChangedCallback();

		//	refresh attributes
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
			const Element = this.Shadow?.querySelector('button');
			if ( Element )
				Element.innerText = newValue;
		}
	}

}

//	name requires dash!
window.customElements.define( 'studio5ui-s5button', S5Button );
