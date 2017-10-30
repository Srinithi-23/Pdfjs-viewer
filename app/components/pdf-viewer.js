import Ember from 'ember';

const {$, run, set, get, setProperties} = Ember;
const {PDFJS} = window;

export default Ember.Component.extend({
	/**
	 * pdfViewer - to set the viewer for the pdf
	 */
	pdfViewer:'',

	/**
	 * pdfLinkService - to get the details of the pdf
	 */
	pdfLinkService:'',

	pdfLoadingTask:'',

	/**
	 * updateCallback - for updating the password
	 */
	updateCallback:'',

	classNames:'preview pdf iframe',//No I18N

	/**
	 * `didInsertElement` event hook used to set the viewer and linkService and load the pdf
	 */
	didInsertElement() {

		let self = this;


	    //PDFJS.workerSrc = get(get(self,'appproperties'),'pc_url')+'/jsapps/team/dist/pdf.worker.js';//No I18N

	  PDFJS.workerSrc = '/assets/pdf/pdf.worker.js';//No I18N

		PDFJS.externalLinkTarget = PDFJS.LinkTarget.BLANK;//to open the links in the pdf in new tab

	    if (get(self,'pdf')) {
	        self.send('load', get(self,'pdf'));//No I18N
	    }
	  },

	/**
	 * `willDestroyElement` event hook used to unbind the scroll when the preview is closed
	 */
	willDestroyElement() {
		let self=this;
		self._super(...arguments);
		//self.unbindScroll('.pdfViewerContainer');//No I18N


		// if(get(self,'pdfLoadingTask')){
		// 	return Promise.resolve;
		// }
		get(self,'pdfLoadingTask').destroy(); //To destroy the requests once the component is destroyed
		set(self,'pdfLoadingTask',null); //No I18N
	},
	/**
	 * 'scroll' event is to handle the scroll for the pages with the help of CustomEvents Mixin
	 */
	// scroll(){
	// 	let self = this;
	//   	self.send('pdfPageNumberUpdate');//No I18N
	// },

	actions: {

		/**
		 * 'load' method is to load the pdf by setting the pdf in the viewer and linkService
		 * @method load
		 */
		load (url) {
			let self = this;

		    let loadingTask = window.PDFJS.getDocument(url);
		    set(self,'pdfLoadingTask',loadingTask); //No I18N

		    /**
			 * PDF error codes (reason):
			 * '1' - password to be given
			 * '2' - invalid password given
			 */
		    loadingTask.onPassword = (updateCallback, reason) => {

		    		set(self,'isPdfPasswordProtected',true);//No I18N


		    		if(reason === 2){
						run.later(function(){
							//Temporary
							$('#pdf_pwd_incorrect_error').removeClass('hide').addClass('show');
						},50);
					}
		    		set(self, 'updateCallback', updateCallback);
		    };

		    loadingTask = loadingTask.then((pdfDocument) => {
		    set(self,'isPdfPasswordProtected',false);//No I18N
		    self.send('setPdfViewer');//No I18N
			  let viewer = get(self,'pdfViewer');
				viewer.setDocument(pdfDocument);
				let linkService = get(self,'pdfLinkService');
				linkService.setDocument(pdfDocument);

			}).catch(function(){
					/**
					 * To handle cases where the PDF might be of invalid structure
					 */
					// set(self,"zdpreview.current_preview_item.isPreviewGenerated",false); //No I18N
					// set(self,'zdpreview.current_preview_item.prvmodel.status_code','-1');
					// setProperties(get(self,'zdpreview.current_preview_item.preview_info'),{'nopreview':true,'preview_error_msg':get(self,'i18nservice').label_preview_not_available});//No I18N
					// set(self,'zdpreview.current_preview_item.isLoading',false);//No I18N
					// $(get(self,'zdpreview.containerID')).trigger('previewReqProcessed');

			});
		},

		/**
		 * 'passwordUpdate' method is for updating the password incase of a password protected pdf
		 * @method passwordUpdate
		 */
		passwordUpdate(pdf_password){
			let self = this;
			if(pdf_password!=''){
				set(self,'isPdfPasswordProtected',false);//No I18N
			    $('#pdf_password').val("");
			    self.updateCallback(pdf_password);
			    //self.send('load',get(self,'pdf'),pdf_password);//No I18N
			}
		},

		// /**
		//  * 'pdfPageNumberUpdate' method is to update the page number as the pdf is scrolled
		//  * @method pdfPageNumberUpdate
		//  */
		// pdfPageNumberUpdate(){
		// 	let self = this;
		// 	self.sendAction('updatePdfPage', get(self,'pdfViewer.currentPageNumber'));
		// },

		/**
		 * 'setPdfViewer' is for setting the viewer and linkService for the pdf
		 * @method setPdfViewer
		 */
		setPdfViewer(){
			let self = this,
			    container = $('.pdfViewerContainer')[0],
			    viewer = $('.pdfViewer')[0];
			let pdfLinkService = new window.PDFJS.PDFLinkService();
		    set(self,'pdfLinkService', pdfLinkService);//No I18N
		    let pdfViewer = new window.PDFJS.PDFViewer({
		      viewer: viewer,
		      container: container,
		      linkService: pdfLinkService
		    });

        //self.bindScroll('.pdfViewerContainer');//No I18N
		    set(self,'pdfViewer', pdfViewer);//No I18N
		    pdfLinkService.setViewer(pdfViewer);//for page-linking : scrollPageIntoView
		    container.addEventListener('pagesinit', function () {
		    	  // We can use pdfViewer now to change the scale.
		    	  pdfViewer.currentScaleValue = 'auto';//No I18N
		    	});

		}

	}

});
