/*
 - web component to load a UIDocument (.uxml file)
 - re-interpret it to html (change paths, node names etc)
 - Load assets
 
 
 It might be possible to use XSLT to transform the XML, but I don't think
 I've used that for 10 years, so unusure of current support.
 
 This approach of reparsing the XML to a DOM and then using webcomponents for the
 UIToolkit components seems more sensible
 
 <ui-document src="Welcome.uxml"></ui-document>
*/
import VisualElement from './UIVisualElement.js'
import Label from './UILabel.js'
import S5Button from './S5Button.js'


function UnityXmlToHtml(Xml)
{
	//	gr: we may be able to use the browser xml parser here, but I recall it only working well on chrome
	//		so instead turn it into parseable html
	
	//	replace incompatible tags & attributes
	//<ui:UXML xmlns:ui="UnityEngine.UIElements" xmlns:uie="UnityEditor.UIElements" xsi="http://www.w3.org/2001/XMLSchema-instance" engine="UnityEngine.UIElements" editor="UnityEditor.UIElements" noNamespaceSchemaLocation="../../../../UIElementsSchema/UIElements.xsd" editor-extension-mode="False">
	//<ui:VisualElement
	//<ui:Label
	//	app custom components
	//<Studio5UI.S5Button
	
	//	ui:UXML is this UI document, but we've already wrapped it (maybe this grand component should be "UnityUI" and
	//	still instantiate a UIdocument inside
	//	gr: perhaps for now just replacing incompatible tag syntax will work?
	
	function RewriteTag(Match,TagOpenClose,TagName,TagContent,TagClose)
	{
		//	gr: special case?
		if ( TagName == "Style" )
		{
			TagContent = TagContent.replace('project://database/Assets/UI/Pages/Error/','');
			return `<style ${TagContent}></style>`;
		}
		
		//	https://dev.to/kamiquasi/painless-web-components-naming-is-not-too-hard-3lon#:~:text=No%20upper%2Dcase%20letters%20allowed,to%20be%20really%20let%20down)
		//	all lower case
		//	one or more hypens
		//	starts with letter
		//	emojis & latin valid
		const Pattern = new RegExp(`[^a-zA-Z0-9-]`,'g');
		let SanitisedTagName = TagName.replaceAll( Pattern,'-');
		SanitisedTagName = SanitisedTagName.toLowerCase();
		
		//	trim start & end multiple hypens, eg. --ui-toolkit--- should be ui-toolkit
		SanitisedTagName = SanitisedTagName.split('-').join('-');
		
		//	must have at least one tag
		if ( !SanitisedTagName.includes('-') )
			SanitisedTagName = `ui-${SanitisedTagName}`;
		
		//	gr: the regex below isn't working so /> ends up with / at the end of content, so steal it
		if ( TagContent.slice(-1) == '/' )
		{
			TagContent = TagContent.slice(0,-1);
			TagClose = `/${TagClose}`;
		}
		
		//	if this is a self closing tag, we need to re-write to not be self closing
		//	.innerHTML doesn't accept self closing tags/>
		if ( TagClose == '/>' )
		{
			TagClose = `></${SanitisedTagName}>`;
		}
		
		return `${TagOpenClose}${SanitisedTagName}${TagContent}${TagClose}`;
	}
	
	//const Pattern = new RegExp(`(</?)([^\\s>]+)`,'g');
	const Pattern = new RegExp(`(</?)([^\\s>]+)(.*)(/?>)`,'g');
	const Html = Xml.replaceAll(Pattern, RewriteTag);

	//	todo: innerHTML doesn't support selfclosing tags/> we need to correct it
	
	return Html;
}


export default class UIDocument extends HTMLElement
{
	constructor()
	{
		super();
		
		this.DomEvents = {};
	}
	
	
	connectedCallback()
	{
		//	create a shadow dom
		this.Shadow = this.attachShadow({mode: 'open'});
		this.OnError(`Initialising...`);
	
		this.attributeChangedCallback();
	}
	
	static get observedAttributes()
	{
		return ['src'];
	}
	
	attributeChangedCallback(name, oldValue, newValue)
	{
		if ( name == 'src' )
		{
			this.LoadUrl( newValue ).catch( this.OnError.bind(this) );
		}
	}

	CreateStyle()
	{
		const Style = document.createElement('style');
		Style.textContent = `:root { display:flex; }`;
		this.Shadow.appendChild(Style);
		//this.Style.textContent = Css ? `@import "${Css}";` : '';
	}
	
	SetDom(NewRootElement)
	{
		if ( typeof NewRootElement == typeof '' )
		{
			//	load new element as html
			this.Shadow.innerHTML = NewRootElement;
		}
		else
		{
			//	clear old dom
			this.Shadow.innerHTML = "";
			this.Shadow.appendChild(NewRootElement);
		}
		this.CreateStyle();
	}
	
	OnError(Error)
	{
		const ErrorBox = document.createElement('div');
		ErrorBox.innerText = `Error: ${Error}`;
		this.SetDom(ErrorBox);
	}
	
	async LoadUrl(Url)
	{
		//	fetch data, parse it, construct new DOM, swap
		const Response = await fetch(Url);
		if ( !Response.ok )
			throw `Fetch(${Url}) failed; {Response.statusText}`;
		
		const XmlBody = await Response.text();
		const HtmlBody = UnityXmlToHtml(XmlBody);
		
		const XmlIsRoot = true;
		if ( XmlIsRoot )
		{
			//	make the browser parse the document which will create webcomponents for custom tags
			this.SetDom( HtmlBody );
		}
		else
		{
			const NewDom = document.createElement('div');
			//	make the browser parse the document which will create webcomponents for custom tags
			//NewDom.innerHTML = HtmlBody;
			
			//	debug
			NewDom.innerText = HtmlBody;
			this.SetDom( NewDom );
		}
	}
}

//	name requires dash!
window.customElements.define( 'ui-document', UIDocument );