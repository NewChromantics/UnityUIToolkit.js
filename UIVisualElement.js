export default class UIVisualElement extends HTMLElement
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

		//const Div = document.createElement('div');
		//Div.style.background = 'red';
		//Div.innerText = 'VisualElement';
		//this.Shadow.appendChild(Div);
		
		this.CreateStyle();

		this.attributeChangedCallback();
	}
	
	attributeChangedCallback(name, oldValue, newValue)
	{
	}

}

//	name requires dash!
window.customElements.define( 'ui-visualelement', UIVisualElement );
