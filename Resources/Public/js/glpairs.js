/***************************************************************
 *  Copyright notice
 *
 *  (c) 2014 Gerald Loß
 *  All rights reserved 
 *
 *  This script is part of the TYPO3 project. The TYPO3 project is
 *  free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  The GNU General Public License can be found at
 *  http://www.gnu.org/copyleft/gpl.html.
 *
 *  This script is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  This copyright notice MUST APPEAR in all copies of the script!
 ***************************************************************/
// some JSHint options
// some global variables we don't need to define here
/*global jQuery:false */
/*global window:false */

/**
 * The main pairs class
 * 
 * @author Gerald Loß
 * @Class 	GLPairs 	The main pairs functions on the client side.
 * @constructor
 * @param {string}	Unique ID of the pairs game. It consist of a prefix with the content element ID
 * 					and a suffix with the uID of the pairs game separated bei an underscore (e.g. 88_234) 
 */
function GlPairs(i_strUniqueId) {
	// turn on the strict mode
	"use strict";
	
	// ***************************************************************/
	// Constructor code and definition of the member attributes 
	// of this class
	// ***************************************************************/

	// store this object in the static array
	GlPairs.arrPairs[i_strUniqueId] = this;
	
	/**
	 * store the Pairs ID in a private variable.
	 * It consist of a prefix with the content element ID and a suffix with 
	 * the uID of the pairs game separated bei an underscore (e.g. 88_234)  */
	var m_strPairsId = i_strUniqueId; 

	/**
	 * Ajax mode, if this flag is true, then we waiting for an ajax request*/
	var m_blnAjaxMode = false;
	
	/**
     * Object with the mapping from external ID to the uID
     * First Index: 	The external ID of the Pair
     * Value:			The uID of the Pair
     * 
     * @var array
	 */
	var m_arrExtIdMapping = null;
	
	/**
     * Object with the status of every card if currently is shown the frontside or backside
     * First Index: 	The external ID of the Pair
     * Value:			true for frontside or false for backside
     * 
     * @var array
	 */
	var m_objCardTurnState = {};

	/**
     * Object with the mapping from the uID to the external ID 
     * First Index: 	The uID of the Pair
     * Value:	array with 2 dimensions (see constants with prefix C_STR_ARR_ID_EXT_ID):
     * 		  extID1: 	The extID1 of the pair
     * 		  extID2: 	The extID2 of the pair
     * @var array
     */
    var m_arrUidMapping = null;
    
    /**
     * Object with the final information data.
     * 	 	Index: The uID of the Pair
	 * 		Value: Array(
	 * 			  isActive  => True if the final information is activated
	 * 			  content   => HTML content with the final information
	 * 			  width     => The width of the final information
	 * 			  height    => The height of the final information
	 * 			  picwidth  => The width of the picture(s)
	 * 			  picheight => The height of the picture(s)
	 *  		)
     */
    var m_objFinalInformation = null;
    
    /**
     * The Type of the pairs game. See the constants with the prefix C_INT_PAIRS_TYPE*
     * @var string
     */
    var m_intPairsType = '';
    
    /**
     * Flag if we are in splitmode. Splitmode means all card pairs are separated.
     * The first cards of the pairs are in the upper area and the second card of 
     * the pairs are in the lower area of the html screen.
     * @var boolean
     */
    var m_blnSplitmode = false;
    
    /**
     * Object with all localized strings for this frontend.
     * See Method PairsController->getI18nFrontendValues() for all values in this object.
     */
    var m_objI18n = null;
    
    /**
     * Object with all parameters for the choosed cards in the game.
     * If we are not in splitmode, then it dont cares of upper and lower card. 
     * The upper card is then always the first and the lower card is always the second 
     * choosed card.
     * 
     * The following parameters are available:
     * upperCardChoosed:	True if the first card is choosed
     * lowerCardChoosed:	True if the second card is choosed
     * upperExtId:			ExtId of the upper choosed card
     * lowerExtId:			ExtId of the lower choosed card
     */
    var m_objClickedCardParams = {	upperCardChoosed	:	false,
    								lowerCardChoosed	:	false,
    								upperExtId			: 	0,
    								lowerExtId			:	0	};
    
    /**
     * Handler for the timeout for the overlay div and its click event.
     * With this variable we can cancel the timeout, if the user click
     * by himself on the overlay div.
     */
    var m_TimeoutOverlayClick = null;
    
    /**
     * Handler for the timeout for the anmiation with a hint
     * that the user has to click for going on after he has choose
     * two cards.
     */
    var m_TimeoutClickHint = null;

    /**
     * The number of pairs in this pairs game.
     */
    var m_intPairsCount = 0;
    
    /**
     * Milliseconds after then the cards turn back automatically, if you have choosed two cards
     */
    var m_intTurnbackDelay = 20000;
    
    /**
     * Milliseconds after then hint apears, that the user has to click for going on
     */
    var m_intClickHintDelay = 10000;
    
    /**
     * Miliseconds for the turn animation of the cards
     */
    var m_intTurnDuration = 500;
    
    /**
     * Miliseconds for the animation of the move of the cards to the stack
     */
    var m_intMoveStackDuration = 500;
    
    /**
     * The Points for a correct choice
     */
    var m_intPointsPlus = 5;
    
    /**
     * The Points for a wrong choice
     */
    var m_intPointsMinus = 1;
    
    /**
     * Flag if test mode is activated.
     */
    var m_blnTestMode = false;
    
    /**
     * Delay between every turn of the cards in the test mode.
     */
    var m_intTestModeTurnDelay = 0;

    // ***************************************************************/
	// Public or privileged function part
	// ***************************************************************/
	
	
	/**
	 * request with AJAX all ID Mappings
	 * 
	 * @function
	 */
	this.requestAjaxGeneralPairsData = function() {
		
		// send the ajax action 'ajaxBasicData' to the backend
		// with this function will be collected all general data for the pairs game
		var strGetParams = jQuery.param({ controllerName  : 'Pairs',
										  actionName	  : 'ajaxBasicData',
										  actionArguments : { i_strUniquId : m_strPairsId }
										});
		// set the ajax mode
		this.setAjaxWaitParams(true);
		// start the inital ajax request
		jQuery.ajax({
			url: '/?PSR-15-eID=glpairs&' + strGetParams,
			dataType: 'json'
			}).done( function(i_jsonResult){
							GlPairs.glpairsHandleAjaxResponse("processAjaxGeneralPairsData", i_jsonResult);
						}
			);
	};

	/**
	 *  handler for the Ajax answer with all pairs ID Mappings
	 *  
	 * @function
	 * @param {Object}	i_jsonResult	The received json data.
	 */
	this.processAjaxGeneralPairsData = function(i_jsonResult) {
		// retrieve the mappings from external ID to uID
		m_arrExtIdMapping = i_jsonResult.result.arrExtIdMap;
		// mapping from uID to external ID
		m_arrUidMapping = i_jsonResult.result.arrUidMap;
		// and the pairs type
		m_intPairsType = i_jsonResult.result.pairsType;
		// the splitmode of the game
		m_blnSplitmode = i_jsonResult.result.splitmode;
		// the localized strings for the frontend
		m_objI18n = i_jsonResult.result.i18n;
		// the number of pairs in the game
		m_intPairsCount = i_jsonResult.result.pairscount;
		
		// set the parameters from the backend
		m_intPointsPlus = i_jsonResult.result.pluspoints;
		m_intPointsMinus = i_jsonResult.result.minuspoints;
		m_intTurnbackDelay = i_jsonResult.result.turnbackdelay;
		m_intClickHintDelay = i_jsonResult.result.hintdelay;
		m_intTurnDuration = i_jsonResult.result.turnduration;
		m_intMoveStackDuration = i_jsonResult.result.stackduration;
		m_blnTestMode = i_jsonResult.result.testmode;
		m_intTestModeTurnDelay = i_jsonResult.result.testmodeturndelay;
		m_objFinalInformation = i_jsonResult.result.finalinformation;
		
		// initialize some global values
		initializeGlobals();
		
		// if we are in test mode
		if (m_blnTestMode) {
			performTestMode();
		} 

		// register the events for the card elements
		registerCardEvents();
	};
	
	
	/**
	 * Set the wait mouse cursor for the whole pairs game and some other parameters
	 * 
	 * @function
	 * @memberOf GLPairs
	 * @param	i_blnSet	{boolean}	If True then set the Wait parameters, if false then unset.
	 */
	this.setAjaxWaitParams = function(i_blnSet) {
		
		// the ID of the main div container
		var l_strMainDivID ="";
		
		// get the ID
		l_strMainDivID = getMainDivId();
		
		// if set the wait parameters
		if (i_blnSet === true) {
			// set the wait cursor for the mouse
			jQuery(l_strMainDivID).css("cursor", "wait");
			// set the ajax mode
			m_blnAjaxMode = true;
		}
		
		// if unset the wait parameters
		else {
			// unset the ajax mode
			m_blnAjaxMode = false;
			// unset the wait cursor for the mouse
			jQuery(l_strMainDivID).css("cursor", "auto");
		}
	};
	
	
	/**
	 * Handle the mouse click event on a card of the pairs game.
	 * 
	 * @function
	 * @param {object}	i_objEvent				Event object with the data of the event.
	 * @param {object}	$i_objCurrentCard	Current card which has received the click event.
	 */
	this.onMouseClickCard = function(i_objEvent, $i_objCurrentCard) {
		// object with the content element uID and the internal ID
		var l_objElementId = {};
		
		l_objElementId = getIdArrayFromId($i_objCurrentCard.attr('id'));
		
		// if we are in test mode
		// and this pair has a final information
		if (m_blnTestMode &&
			m_objFinalInformation[m_arrExtIdMapping[l_objElementId.extId]].isActive) {
			
			// set the global variables with the booth choosed cards
			setCorrespondingChoosedCards(l_objElementId);
			
			// show the final information
			showFinalInformation(m_objFinalInformation[m_arrExtIdMapping[l_objElementId.extId]], m_blnTestMode);	
				
			// initialize the global atttribute with the currently chosed cards
			initializeClickedCardParams();

		}
		// if we are in test mode
		// and this pair has no final information
		else if (m_blnTestMode &&
			m_objFinalInformation[m_arrExtIdMapping[l_objElementId.extId]].isActive === false) {
			
			// flip over the card
			flipOverCard(l_objElementId.extId, l_objElementId.area ); 
			flipOverCard(getCorrespondingExtId(l_objElementId.extId), getCorrespondingArea(l_objElementId.area) ); 
		
		}
		// if the click on this card was allowed
		else if (isClickAllowed(l_objElementId)){
			
			// unregister the click events if two correct cards are choosed
			unregisterEventsConditional();
			
			// flip over the card
			flipOverCard(l_objElementId.extId, l_objElementId.area ); 
			
			// check if the choosen pair is correct
			checkForCorrectPair();
		}
	};
	
	/**
	 * Handle the mouse click event on the overlay div after the both cards are choosen.
	 * 
	 * @function
	 * @param {object}	i_objEvent				Event object with the data of the event.
	 * @param {object}	$$i_objOverlay			The averlay div which has received the click event.
	 */
	this.onMouseClickOverlayPairFinished = function(i_objEvent, $i_objOverlay) {
		
		// the click hint element
		var $l_objClickHint = null;

		
		// first cancel timeout if this is an user click
		window.clearTimeout(m_TimeoutOverlayClick);
		window.clearTimeout(m_TimeoutClickHint);
		
		// destroy the overlay again
		$i_objOverlay.remove();
		
		// if the animation with the cklick hint is already running, 
		// then try to stop it now
		$l_objClickHint = jQuery('#' + m_strPairsId + '_' + GlPairs.C_STR_ID_SUFFIX_CLICK_HINT);
		$l_objClickHint.remove();
		
		// do the after pair processing
		afterPairProcessing();
	};

	/**
	 * The event of the end of the turn back of the cards. This event is only registerd if
	 * two correct cards are choosen. In this case must the both cards moved to the card stack
	 * after the turn back animation is finished.
	 * 
	 * @function
	 * @param {object}	i_objEvent				Event object with the data of the event.
	 * @param {object}	$i_objBackCard			The back card which should be moved to the card stack
	 */
	this.onTurnBackCardEnd = function(i_objEvent, $i_objBackCard) {
		
		// animate the card to the stack
		animateCard2Stack($i_objBackCard);
	};
	
	// ***************************************************************/
	// Private function part
	// ***************************************************************/
	
	/**
	 * Regsiter with jQuery all Events for the cards.
	 * 
	 * @function
	 * @inner
	 * @memberOf GLPairs
	 */
	function registerCardEvents(){
		// the ID of the main div element container for this pairs game
		var l_strMainDivId = '';
		
		l_strMainDivId = getMainDivId();
		
		// select all elements of this pairs container and filter
		// for all anchor elements of the cards
		jQuery(l_strMainDivId).find(".glpairs_cls_click_content").each(
			function(i_intIndex){
				// the current anchor element
				var $l_objCurrentAnchor = jQuery(this);
				
				// register the mouse click event
				$l_objCurrentAnchor.click(
					function(i_objEvent){
						// call the event handler which delegates the request to the actual handler
						GlPairs.glpairsEventHandler(m_strPairsId, i_objEvent, 'onMouseClickCard', $l_objCurrentAnchor);
					}
				);
			}
		
		);
	}
	
	/**
	 * Returns the ID of the main div container which contains the whole pairs game
	 * with a # prefix for jQuery
	 * 
	 * @function
	 * @inner
	 * @memberOf GLPairs
	 */
	function getMainDivId(){
		
		// the ID of the main div container
		var l_strID ="";
		
		l_strID = "#" + m_strPairsId + "_glpairs_container";
		return l_strID;
	}
	
	/**
	 * Returns an array with the id prefix of an HTML element ID.
	 * 
	 * @function
	 * @inner
	 * @memberOf GLPairs
	 * @return {object}	Object with four elements
	 * 						pairsId:	ID for the content element of the whole pairs game
	 * 						extId:		internal Id of the card
	 * 						area:		weather we are in the lower or upper area
	 * 						suffix:		the suffix of the ID
	 */
	function getIdArrayFromId(i_strId){
		// the position in the string
		var l_intStrPos = 0;
		// the returning object
		var l_objResult = { 'pairsId': 	0,
							'extId':	0,
							'area':		'',
							'suffix':	''};
		
		// get the Pairs ID ****************************************************************
		// get the position of the first underscore
		l_intStrPos = i_strId.indexOf('_');
		// get the pairs ID
		l_objResult.pairsId = i_strId.substr(0, l_intStrPos);
		l_intStrPos++;
		// delete the prefix with the pairs ID
		i_strId = i_strId.substr(l_intStrPos);
		// get the position of the first underscore
		l_intStrPos = i_strId.indexOf('_');
		// get the internal ID
		l_objResult.pairsId = l_objResult.pairsId + '_' + i_strId.substr(0, l_intStrPos);

		// get the external ID **************************************************************
		l_intStrPos++;
		// delete the prefix with the pairs ID
		i_strId = i_strId.substr(l_intStrPos);
		// get the position of the first underscore
		l_intStrPos = i_strId.indexOf('_');
		// get the internal ID
		l_objResult.extId = i_strId.substr(0, l_intStrPos);

		// get the area *********************************************************************
		l_intStrPos++;
		// delete the prefix with the internal ID
		i_strId = i_strId.substr(l_intStrPos);
		// get the position of the first underscore
		l_intStrPos = i_strId.indexOf('_');
		// get the area
		l_objResult.area = i_strId.substr(0, l_intStrPos);

		// get the suffix ********************************************************************
		l_intStrPos++;
		// the remaining is the suffix
		l_objResult.suffix = i_strId.substr(l_intStrPos);
		
		// return the result
		return l_objResult;
	}
	
	
	/**
	 * Returns an array with the id prefix of an HTML element ID.
	 * 
	 * @function
	 * @inner
	 * @memberOf GLPairs
	 * @param integer	i_intExtID			The external ID of the card.
	 * @param string	i_strArea			The area of the card. Upper or lower area is possible.
	 * @param string 	i_strCardElement	Element of the card (back or front)
	 * @param boolean	i_blnToFront		True if the element should turn to the front else to the back
	 */
	function toggleClassOfCardElement(i_intExtId, i_strArea, i_strCardElement, i_blnToFront){
		// a card element
		var $l_objCardElement = null;
		// id of the div element of a card
		var l_strCardDivId = '';
		// the turn duration in seconds
		var l_fltTurnDuration = 0;
		
		// build the ID of the cardelement
		l_strCardDivId = getIdFromExtId(i_intExtId, i_strArea, i_strCardElement);
		
		// get the div element with the ID
		$l_objCardElement = jQuery(l_strCardDivId);
		
		
		
		// set the duration in seconds
		l_fltTurnDuration = Math.round( m_intTurnDuration / 100 );
		l_fltTurnDuration = l_fltTurnDuration / 10;
		$l_objCardElement.css('transition', 'all ' + l_fltTurnDuration + 's');
		

		// if the turn to the front side is demanded 
		if ( i_blnToFront){
			// turn to frontside
			$l_objCardElement.css({'transform' : 'rotateY( 0deg )',
								  '-moz-transform' : 'rotateY( 0deg )',
								  '-ms-transform' : 'rotateY( 0deg )',
								  '-o-transform' : 'rotateY( 0deg )',
								  '-webkit-transform' : 'rotateY( 0deg )'});
		} else {
			// turn to backside
			$l_objCardElement.css({'transform' : 'rotateY( 180deg )',
								   '-moz-transform' : 'rotateY( 180deg )',
								   '-ms-transform' : 'rotateY( 180deg )',
								   '-o-transform' : 'rotateY( 180deg )',
								   '-webkit-transform' : 'rotateY( 180deg )'});
		}
	}
	
	
	/**
	 * Check if mouseclick of a card is in the current state allowed.
	 * 
	 * @function
	 * @inner
	 * @memberOf GLPairs
	 * @param {object}	i_objElementId		Array with three elements of the current clicked card.
	 * 											pairsId:	ID for the content element of the whole pairs game
	 * 											extId:		internal Id of the card
	 * 											area:		weather we are in the lower or upper area
	 * 											suffix:		the suffix of the ID
	 * @return boolean						True if the click was allowed
	 */
	function isClickAllowed(i_objElementId){
		// the returning flag, it is by default true
		var l_blnReturn = true;
		// the html element for the modal dialog 
		var modalElement = null;
		
		// if there are still two cards choosen
		// this could only happen if the user click very fast and often on the screen
		if ( m_objClickedCardParams.upperCardChoosed && 
				m_objClickedCardParams.lowerCardChoosed ) {

			// do nothing
			l_blnReturn = false;
		
		// if the same card was clicked again
		} else if (   m_objClickedCardParams.upperExtId == i_objElementId.extId ||
					  m_objClickedCardParams.lowerExtId == i_objElementId.extId ){
			// do nothing
			l_blnReturn = false;
		
		// if we are in split mode
		} else if (m_blnSplitmode) {
			
			// if a card of the upper area is clicked
			if (i_objElementId.area == GlPairs.C_STR_AREA_UPPER ) {
				// if a card of the upper area is already choosed
				if (m_objClickedCardParams.upperCardChoosed){
					
					// return false
					l_blnReturn = false;
					
					// the modal dialog 
					var modalDialog = null;
					var modalElement = null;

					// start a error dialog
				 	modalElement = jQuery(getModalHtmlElement(m_objI18n.errorWrongCardClickedUpper));
					new bootstrap.Modal(modalElement).show();
					
				// if no card of this area is choosed
				} else {
					// remember this state and the external ID
					m_objClickedCardParams.upperCardChoosed = true;
					m_objClickedCardParams.upperExtId = i_objElementId.extId;
				}

			// if a card of the lower area is clicked
			} else if (i_objElementId.area == GlPairs.C_STR_AREA_LOWER ) {
				// if a card of the upper area is already choosed
				if (m_objClickedCardParams.lowerCardChoosed){
					// return false
					l_blnReturn = false;
					// start a error dialog
				 	modalElement = jQuery(getModalHtmlElement(m_objI18n.errorWrongCardClickedLower));
					new bootstrap.Modal(modalElement).show();

				// if no card of this area is choosed
				} else {
					// remember this state and the external ID
					m_objClickedCardParams.lowerCardChoosed = true;
					m_objClickedCardParams.lowerExtId = i_objElementId.extId;
				}
			}
		
		// if we are not in splitmode
		} else {
			
			// if already one card is choosed
			if (m_objClickedCardParams.upperCardChoosed) {
				// remember the second card
				m_objClickedCardParams.lowerCardChoosed = true;
				m_objClickedCardParams.lowerExtId = i_objElementId.extId;

			// if no card was already choosed
			} else {
				// remember the first card
				m_objClickedCardParams.upperCardChoosed = true;
				m_objClickedCardParams.upperExtId = i_objElementId.extId;
			}
		}
		
		return l_blnReturn;
	}
	
	/**
	 * Check if there was choosen a correct pair of cards
	 * 
	 * @function
	 * @inner
	 * @memberOf GLPairs
	 */
	function checkForCorrectPair(){
		
		// if both cards are choosen
		if (m_objClickedCardParams.upperCardChoosed	&& m_objClickedCardParams.lowerCardChoosed){
			
			// it is from the same pair
			if(m_arrExtIdMapping[m_objClickedCardParams.upperExtId] ==
											 m_arrExtIdMapping[m_objClickedCardParams.lowerExtId]){

				// set the indicator for a correct choice
				setChoosenIndicator(GlPairs.C_STR_CARD_BORDER_CLASS_RIGHT);
			}
			
			// if it is not from the same pair
			else {
				// set the indicator for a wrong choice
				setChoosenIndicator(GlPairs.C_STR_CARD_BORDER_CLASS_WRONG);
			}
			
			// if the correct pair is choosed and the final information is activated
			if(m_arrExtIdMapping[m_objClickedCardParams.upperExtId] ==
				 								m_arrExtIdMapping[m_objClickedCardParams.lowerExtId] &&
				m_objFinalInformation[m_arrExtIdMapping[m_objClickedCardParams.upperExtId]].isActive){
				
				// show the final information for this pair, after the card is turn around
				window.setTimeout( function(){
						showFinalInformation(m_objFinalInformation[m_arrExtIdMapping[m_objClickedCardParams.upperExtId]]);},
					  	m_intTurnDuration );
			
			// if final information is not activated or the wrong pairs is choosed
			} else {
				// create a transparent overlay div, where the user can cklick on it
				// for going on. The click event will transferred to the method
				// onMouseClickOverlayPairFinished()
				// this overlay will be created with some delay, after the turn of the cards is finished
				// if the user click to fast on this overlay while the turn is not over
				// we cannot calculate the location of the card properly for the animation
				window.setTimeout( function(){setClickableOverlayDiv('onMouseClickOverlayPairFinished');},
						  	m_intTurnDuration );
			}
		}
	}
	
	/**
	 * Show the final information of a correct pair.
	 * 
	 * @function
	 * @inner
	 * @memberOf GLPairs
	 * 
	 * @param	object	i_objFIData	Object with the data of the final information.
	 * 					isActive: 	true if final information is activated
	 * 					content:	The content of the final information
	 * 					width:		The width of the final information
	 * 					height:		The height of the final information
	 * 					picwidth:	The width of the picture(s)
	 * 					picheight:	The height of the picture(s)
	 * @param 	boolean	i_blnForTestMode	True, if this is for the test mode
	 */
	function showFinalInformation(i_objFIData, i_blnForTestMode){
		
		// if i_blnForTestMode is omited then false
		/**
		 * @default false
		 */
		i_blnForTestMode = typeof i_blnForTestMode == 'undefined' ? false : i_blnForTestMode;

		// the html content of the final information
		var l_strContent = '';
		// the modal dialog box
		var $l_objModalBox = null;
		
		// build the final information html content for the modal window 
		l_strContent = getModalHtmlElementFinalInformation(
						    i_objFIData.content, 
							getSelectedPictureHtmlContent(i_objFIData),
							i_objFIData.height,
							i_objFIData.width);
		
		// create the dialog with the final information message
		$l_objModalBox = jQuery(l_strContent).modal({show: false});
		
		// if the dialog box is closed, then start the animation of the cards
		// to move them on the heap
		$l_objModalBox.on('hidden.bs.modal', function(){
			// if we are not in test mode
			if (!i_blnForTestMode){
				// do the after pair processing
				afterPairProcessing();
			}
		});
		
		// finally show the modal window
		$l_objModalBox.modal('show');
	}
		
	/**
	 * Returns the HTML content of the curently choosen pictures.
	 * 
	 * @function
	 * @inner
	 * @memberOf GLPairs
	 * 
	 * @param	object	i_objFIData	Object with the data of the final information.
	 * 					isActive: 	true if final information is activated
	 * 					content:	The content of the final information
	 * 					width:		The width of the final information
	 * 					height:		The height of the final information
	 * 					picwidth:	The width of the picture(s)
	 * 					picheight:	The height of the picture(s)
	 * @return	string	The HTML content of the pictures.
	 */
	function getSelectedPictureHtmlContent(i_objFIData){
		
		// the picture element
		var $l_objPictureElement = null;
		// the returning HTML content
		var l_strHtmlContent = '';
		// the area of the card
		var l_strArea = '';
		
		// we are in text only mode
		if( m_intPairsType == GlPairs.C_INT_PAIRS_TYPE_TextOnly ){
			// there is no picture content
			return l_strHtmlContent;
		}
		
		// for the first card it is always the upper area
		l_strArea = GlPairs.C_STR_AREA_UPPER;

		// try to get the first card 
		$l_objPictureElement = jQuery(getIdFromExtId(m_objClickedCardParams.upperExtId,
													l_strArea,
													GlPairs.C_STR_ID_SUFFIX_FRONT_CARD));

		// if there is a picture found
		if($l_objPictureElement.length == 1 && $l_objPictureElement.prop("nodeName") == "IMG"){
			// get the HTML content
			l_strHtmlContent = getPictureHtmlContent($l_objPictureElement, i_objFIData);
		}
		
		// if the pairs type is same picture
		if( m_intPairsType == GlPairs.C_INT_PAIRS_TYPE_SamePic ){
			// we need only one
			return l_strHtmlContent;
		}
		
		// try to get the second card 
		$l_objPictureElement = jQuery(getIdFromExtId(m_objClickedCardParams.lowerExtId,
													getCorrespondingArea(l_strArea),
													GlPairs.C_STR_ID_SUFFIX_FRONT_CARD));
		
		// if there is a picture found
		if($l_objPictureElement.length == 1 && $l_objPictureElement.prop("nodeName") == "IMG"){
			// get the HTML content
			l_strHtmlContent += getPictureHtmlContent($l_objPictureElement, i_objFIData);
		}
		
		return l_strHtmlContent;
	}

	
	/**
	 * Returns the HTML content of a given picture.
	 * 
	 * @function
	 * @inner
	 * @memberOf GLPairs
	 * 
	 * @param	object	$i_objPicture	The jQuery element of the picture.
	 * @param	object	i_objFIData	Object with the data of the final information.
	 * 					isActive: 	true if final information is activated
	 * 					content:	The content of the final information
	 * 					width:		The width of the final information
	 * 					height:		The height of the final information
	 * 					picwidth:	The width of the picture(s)
	 * 					picheight:	The height of the picture(s)
	 * @return	string	The HTML content of the pictures.
	 */
	function getPictureHtmlContent($i_objPicture, i_objFIData){
		// the new picture element
		var $l_objPictureElementNew = null;

		// clone the picture 
		$l_objPictureElementNew = $i_objPicture.clone();
		// and remove not necessary attributes
		$l_objPictureElementNew.css("border-width", "0px");
		$l_objPictureElementNew.removeClass("glpairs_cls_card_border_right");
		$l_objPictureElementNew.attr("id", "");
		// set the padding value
		$l_objPictureElementNew.css("padding", "10px");
		
		// if no width is given
		if (i_objFIData.picwidth === 0) {
			$l_objPictureElementNew.css("width", "");
		} else {
			$l_objPictureElementNew.css("width", i_objFIData.picwidth);
		}
		
		// if no heigth is given
		if (i_objFIData.picheight === 0) {
			$l_objPictureElementNew.css("height", "");
		} else {
			$l_objPictureElementNew.css("height", i_objFIData.picheight);
		}
		
		// return the HTML content
		return $l_objPictureElementNew.prop("outerHTML");
	}
	
	/**
	 * Set indocator if the pair which is choosen is a correct or a wrong pair
	 * 
	 * @function
	 * @inner
	 * @memberOf GLPairs
	 * 
	 * @param	string	i_strNewClass	The new class which should indicate this state
	 */
	function setChoosenIndicator(i_strNewClass){	
		
		// the current HTML element
		var $l_currentElement = null;
		// the area of the current HTML element
		var l_strCurrentArea = '';
		
		// for the first card it is always the upper area
		l_strCurrentArea = GlPairs.C_STR_AREA_UPPER;
		
		// get the first card
		$l_currentElement = jQuery(getIdFromExtId(m_objClickedCardParams.upperExtId,
														l_strCurrentArea,
														GlPairs.C_STR_ID_SUFFIX_FRONT_CARD));

		// change with an blinking border to the new class 
		blinkBorder($l_currentElement, i_strNewClass);	
		
		// get the second card
		$l_currentElement = jQuery(getIdFromExtId(m_objClickedCardParams.lowerExtId,
												  getCorrespondingArea(l_strCurrentArea),
												  GlPairs.C_STR_ID_SUFFIX_FRONT_CARD));
		
		// change with an blinking border to the new class
		blinkBorder($l_currentElement, i_strNewClass);	
	}
	
	
	/**
	 * Build the ID of e HTML element from the external Id.
	 * 
	 * @function
	 * @inner
	 * @memberOf GLPairs
	 * 
	 * @param	integer	i_intExtId	the external ID
	 * @param	string	i_strArea	The area. Upper or lower area is possible.
	 * @param	string	i_strSuffix	The suffix of the ID.
	 * @return	string				The ID of the HTML element.
	 */
	function getIdFromExtId(i_intExtId, i_strArea, i_strSuffix){	
		return '#' + m_strPairsId + '_' + i_intExtId + '_' +  i_strArea + '_' + i_strSuffix;
	}

	/**
	 * Build the ID of e HTML element from the external Id.
	 * 
	 * @function
	 * @inner
	 * @memberOf GLPairs
	 * 
	 * @param	{object}	$i_obj_card			The jQuery object of the card
	 * @param	string		i_strTargetClass	The target class after the border has blinked.
	 */
	function blinkBorder($i_obj_card, i_strTargetClass){
		
		
		// if the counter is still not created
		if (typeof(blinkBorder.counter) == 'undefined'){
			// create it
			blinkBorder.counter = [];
		}
		
		// if the element in the counter array is not set
		if (typeof(blinkBorder.counter[$i_obj_card.attr('id')]) == 'undefined'){
			blinkBorder.counter[$i_obj_card.attr('id')] = 0;
		}

		// for the first time 
		if(blinkBorder.counter[$i_obj_card.attr('id')] === 0){
			blinkBorder.counter[$i_obj_card.attr('id')]++;
			// we need to wait n miliseconds without changings
			// because we need to wait for the turn of the card
			window.setTimeout(function(){blinkBorder($i_obj_card, i_strTargetClass);}, m_intTurnDuration);
			return;
		}
		
		// after the 4th blink 
		if(blinkBorder.counter[$i_obj_card.attr('id')]++ == 4){
			// initialize all static variables
			blinkBorder.counter[$i_obj_card.attr('id')] = 0;
			// finish the incremental loop
			return;
		}
			
		// toggle the target and the standard class
		$i_obj_card.toggleClass(GlPairs.C_STR_CARD_BORDER_CLASS_DEFAULT);
		$i_obj_card.toggleClass(i_strTargetClass);
		
		// after a timeout of 200 milliseconds toggle the classes again
		window.setTimeout(function(){blinkBorder($i_obj_card, i_strTargetClass);}, 200);	
	}

	/**
	 * Set a div element over the whole game, for catching a click event.
	 * 
	 * @function
	 * @inner
	 * @memberOf GLPairs
	 * 
	 * @param	string		i_strEventHandler	Handler method for the click event.
	 */
	function setClickableOverlayDiv(i_strEventHandler){
		// the main div element
		var $l_objMainDiv = null;
		// the overlay div
		var $l_objOverlayDiv = null;
		// ID of the main div element
		var l_strMainDivId = '';
		
		// create the ID of the main div element
		l_strMainDivId = getMainDivId();
		
		// get the main div element itself
		$l_objMainDiv = jQuery(l_strMainDivId);
		
		$l_objOverlayDiv = jQuery('<div/>', {
				id: m_strPairsId + '_' + 'overlay',
				style: 		'width: ' + $l_objMainDiv.width() + 'px;' +
						 	'height: ' + $l_objMainDiv.height() + 'px;' +
							'top: ' + $l_objMainDiv.position().top + 'px;' +
							'left: ' + $l_objMainDiv.position().left + 'px;' +
							'opacity: 1;' +
						    'position: absolute;'
			});
		
		// append the overlay
		$l_objMainDiv.append($l_objOverlayDiv);
		
		// register the mouse click event
		$l_objOverlayDiv.click(
			function(i_objEvent){
				// call the event handler which delegates the request to the actual handler
				GlPairs.glpairsEventHandler(m_strPairsId, i_objEvent, i_strEventHandler, $l_objOverlayDiv);
			}
		);
		
		// if the automatic click is not deactivated
		if (m_intTurnbackDelay !== 0){
			// click on the everlay after n seconds automatically
			m_TimeoutOverlayClick = window.setTimeout(function(){$l_objOverlayDiv.trigger('click');}, m_intTurnbackDelay);
		}
		
		// if the click hint is not deactivated
		if (m_intClickHintDelay !== 0){
			m_TimeoutClickHint = window.setTimeout(function(){showAnimatedClickHint();},m_intClickHintDelay);
		}
		
	}
	
	/**
	 * Turns the both choosen cards back again.
	 * 
	 * @function
	 * @inner
	 * @memberOf GLPairs
	 */
	function turnBackCards(){
		// element with the border of the card
		var $l_objBorderElement = null;
		// the area of the card
		var l_strArea = '';
		// the class of the current border of the choosen cards
		var l_strCurrentBorderClass = '';
		
		// if the correct pair was choosen
		if(m_arrExtIdMapping[m_objClickedCardParams.upperExtId] ==
										 m_arrExtIdMapping[m_objClickedCardParams.lowerExtId]){
			// the current border class is right
			l_strCurrentBorderClass = GlPairs.C_STR_CARD_BORDER_CLASS_RIGHT;
		}
		else{
			// the current border class is wrong
			l_strCurrentBorderClass = GlPairs.C_STR_CARD_BORDER_CLASS_WRONG;
		}

		// for the first card it is always the upper area
		l_strArea = GlPairs.C_STR_AREA_UPPER;
		
		// flip over the first card
		flipOverCard(m_objClickedCardParams.upperExtId, l_strArea ); 

		// get the border element of the first card 
		$l_objBorderElement = jQuery(getIdFromExtId(m_objClickedCardParams.upperExtId,
													l_strArea,
													GlPairs.C_STR_ID_SUFFIX_FRONT_CARD));
		// and toggle the card back to the default border class
		$l_objBorderElement.toggleClass(GlPairs.C_STR_CARD_BORDER_CLASS_DEFAULT);
		$l_objBorderElement.toggleClass(l_strCurrentBorderClass);
		
		// flip over the second card
		flipOverCard(m_objClickedCardParams.lowerExtId, getCorrespondingArea(l_strArea)); 

		// get the border element of the second card 
		$l_objBorderElement = jQuery(getIdFromExtId(m_objClickedCardParams.lowerExtId,
													getCorrespondingArea(l_strArea),
													GlPairs.C_STR_ID_SUFFIX_FRONT_CARD));
		// and toggle the card back to the default border class
		$l_objBorderElement.toggleClass(GlPairs.C_STR_CARD_BORDER_CLASS_DEFAULT);
		$l_objBorderElement.toggleClass(l_strCurrentBorderClass);
	}
	
	/**
	 * Adds the givven value to the result of the pairs game
	 * 
	 * @function
	 * @inner
	 * @memberOf GLPairs
	 * 
	 * @param	integer	i_intValue	The value which should be added to the result.
	 */
	function setResultOfGame(i_intValue){
		
		// the jQuery object with the result div element
		var $l_objResult = null;
		// the ID of the result div element
		var l_strResultID = '';
		// the current value of the result
		var l_intCurrentValue = 0;
		
		// create the ID of the result div element
		l_strResultID = '#' + m_strPairsId + '_' + GlPairs.C_STR_ID_SUFFIX_RESULT;
		
		// get the element
		$l_objResult = jQuery(l_strResultID);
		
		// get the current value
		l_intCurrentValue = parseInt($l_objResult.text());
		
		// add the new value to the current value
		l_intCurrentValue += i_intValue;
		
		// write it back into the DOM
		$l_objResult.text(l_intCurrentValue);
		
		if(i_intValue < 0){
			// toggle a red background for 1 second
			$l_objResult.toggleClass('glpairs_cls_result_negative');
			window.setTimeout(function(){$l_objResult.toggleClass('glpairs_cls_result_negative');}, 1000);
		}
		else{
			// toggle a green background for 1 second
			$l_objResult.toggleClass('glpairs_cls_result_positive');
			window.setTimeout(function(){$l_objResult.toggleClass('glpairs_cls_result_positive');}, 1000);
		}
	}

	/**
	 * Get the result of the game.
	 * 
	 * @function
	 * @inner
	 * @memberOf GLPairs
	 */
	function getResultOfGame(){
		
		// the jQuery object with the result div element
		var $l_objResult = null;
		// the ID of the result div element
		var l_strResultID = '';
		// the current value of the result
		var l_intCurrentValue = 0;
		
		// create the ID of the result div element
		l_strResultID = '#' + m_strPairsId + '_' + GlPairs.C_STR_ID_SUFFIX_RESULT;
		
		// get the element
		$l_objResult = jQuery(l_strResultID);
		
		// get the current value
		l_intCurrentValue = parseInt($l_objResult.text());
		
		// return the value
		return l_intCurrentValue;
	}

	/**
	 * Initialize the global attribute m_objClickedCardParams with the currently choosed cards
	 * 
	 * @function
	 * @inner
	 * @memberOf GLPairs
	 */
	function initializeClickedCardParams(){
		m_objClickedCardParams.upperCardChoosed = false;
		m_objClickedCardParams.lowerCardChoosed = false;
		m_objClickedCardParams.upperExtId = 0;
		m_objClickedCardParams.lowerExtId = 0;
	}
	
	/**
	 * Move one cards to the stack, so that the could not choosed again.
	 * 
	 * @function
	 * @inner
	 * @memberOf GLPairs
	 * 
	 * @param {object}	$i_objCard	jQuery object with the card element, which should be animated.
	 * @param integer	i_intExtId	The external ID of the card.
	 * @param string	i_strArea	The area of the card
	 */
	function animateCard2Stack($i_objCard){
		// the place with the card stack
		var $l_objCardStack = null;
		// the offset from the top
		var l_intOffsetTop = 0;
		// the offset from the left
		var l_intOffsetLeft = 0;
		// random offset for the animation
		var l_fltRandomOffsetTop = 0;
		var l_fltRandomOffsetLeft = 0;
		
		var l_intCardstackOffset = 0;
		var l_intCardOffset = 0;

		
		// get the card stack
		$l_objCardStack = jQuery('#' + m_strPairsId + '_' + GlPairs.C_STR_ID_SUFFIX_CARD_STACK);
		
		// get random values for the offset
		l_fltRandomOffsetTop = getRandomNumber4Animation();
		l_fltRandomOffsetLeft = getRandomNumber4Animation();
		
		// compute top offset
		l_intCardstackOffset = $l_objCardStack.offset().top;
		l_intCardOffset = $i_objCard.offset().top;
		l_intOffsetTop = l_intCardstackOffset - l_intCardOffset + l_fltRandomOffsetTop;
		
		// compute left offset
		l_intCardstackOffset = $l_objCardStack.offset().left;
		l_intCardOffset = $i_objCard.offset().left;
		l_intOffsetLeft = l_intCardstackOffset - l_intCardOffset + l_fltRandomOffsetLeft;
		
		// change position to relative, otherwise the animation has no effect
		$i_objCard.css('position', 'relative');
		// remove the classes with the HTML5 parameters
		// this is disturbing the animation
		$i_objCard.removeClass('glpairs_cls_card_visible');
		$i_objCard.removeClass('glpairs_cls_card_common');
		$i_objCard.css('transition', '');


		// move the card to the stack
		$i_objCard.animate({ top: '+=' + l_intOffsetTop ,
			 				 left: '+=' + l_intOffsetLeft 
		   					}, 
		   					{ duration: m_intMoveStackDuration,
		   					  easing: 'linear'
		   					});
		   					
		
		// turn the card a little bit after the animation
		window.setTimeout(function(){turnCard($i_objCard);}, m_intMoveStackDuration / 2);
	}
	
	/**
	 * Turn the card randomly a little bit
	 * 
	 * @function
	 * @inner
	 * @memberOf GLPairs
	 * 
	 * @param {object}	$i_objCard	jQuery object with the card element, which should be turned.
	 */
	function turnCard($i_objCard){	
		
		// the random degrees of the the turn
		var l_fltDegrees = 0;
		
		// first get a random number between 0 and 1
		l_fltDegrees = Math.random();
		// transform it to a number between -1000 and 1000
		l_fltDegrees = Math.round(l_fltDegrees * 2000 - 1000);
		// and now transform it to a number between -10 and 10 with two digits after the point
		l_fltDegrees = l_fltDegrees / 100;
		
		$i_objCard.css('transform', 'rotateZ( ' + l_fltDegrees + 'deg )');
		$i_objCard.css('-ms-transform', 'rotateZ( ' + l_fltDegrees + 'deg )');
		$i_objCard.css('-moz-transform', 'rotateZ( ' + l_fltDegrees + 'deg )');
		$i_objCard.css('-webkit-transform', 'rotateZ( ' + l_fltDegrees + 'deg )');
		$i_objCard.css('-o-transform', 'rotateZ( ' + l_fltDegrees + 'deg )');
	}
	
	/**
	 * Turn the card randomly a little bit
	 * 
	 * @function
	 * @inner
	 * @memberOf GLPairs
	 */
	function gameFinishedDialog(){
		// the dialof string formated
		var l_strDialog = '';
		
		l_strDialog = m_objI18n.gameFinished;
		
		l_strDialog = l_strDialog.replace('&1', getResultOfGame()); 
		
		// start a dialog with the finished message
		jQuery(getModalHtmlElement(l_strDialog)).modal();
	}

	/**
	 * Returns a Random Offset for the animation
	 * 
	 * @function
	 * @inner
	 * @memberOf GLPairs
	 * 
	 * @return number
	 */
	function getRandomNumber4Animation(){
		// the random number
		var l_fltRandom = 0;
		
		// comute a random offset between 10 and 20
		l_fltRandom = Math.random();
		l_fltRandom = Math.round(l_fltRandom * 10 + 10);
		return l_fltRandom;
	}
	
	/**
	 * Show an animated hint for doing a click an the pairs game. After the user
	 * has choosed two cards he need to click on the game for going on.
	 * 
	 * @function
	 * @inner
	 * @memberOf GLPairs
	 */
	function showAnimatedClickHint(){
		// the main div element
		var $l_objMainDiv = null;
		// the dialog itself
		var $l_objDialog = null;
		// the left property of the div element
		var l_intLeft = 0;
		// the duration of the animation in milliseconds
		var l_intDuration = 0;

		// get the main div element itself
		$l_objMainDiv = jQuery(getMainDivId());
		
		// create the dialog with the click hint
		$l_objDialog = jQuery("<div />",{
				id:		m_strPairsId + '_' + GlPairs.C_STR_ID_SUFFIX_CLICK_HINT,
				'class':	'glpairs_cls_click_hint',
				style:	'top: ' + ($l_objMainDiv.height() + $l_objMainDiv.position().top) + 'px; '
			});
		$l_objDialog.html(m_objI18n.clickHint);
		
		// append the new element
		$l_objMainDiv.append($l_objDialog);
		
		// now with the content we know the width of the div element
		// and we can caculate the left property
		l_intLeft = $l_objMainDiv.width() - $l_objDialog.width();
		if (l_intLeft < 0) {
			l_intLeft = 0;
		}
		l_intLeft = Math.round(l_intLeft / 2);
		
		// set the left property
		$l_objDialog.css('left', l_intLeft);
		
		// caculate the duration
		l_intDuration = $l_objMainDiv.height() * 10;
		
		$l_objDialog.animate(
				{ top: '-=' + $l_objMainDiv.height() },
				l_intDuration,
				'linear'
			).animate(
				{ opacity: 0 },
				500,
				function(){
					// after the animation is finished
					// we need to remove the div element again
					$l_objDialog.remove(); }
			);
	}

	/**
	 * unregister the click event if two correct cards are choosed
	 * 
	 * @function
	 * @inner
	 * @memberOf GLPairs
	 */
	function unregisterEventsConditional(){
		
		// a card element
		var $l_objCardElement = null;
		// id of the div element of a card
		var l_strCardDivId = '';
		// the area of the card
		var l_strArea = '';
		
		// if both cards are choosen
		// and it is from the same pair
		if (m_objClickedCardParams.upperCardChoosed	&& m_objClickedCardParams.lowerCardChoosed &&
			m_arrExtIdMapping[m_objClickedCardParams.upperExtId] ==
											 m_arrExtIdMapping[m_objClickedCardParams.lowerExtId]){

			// for the first card it is always the upper area
			l_strArea = GlPairs.C_STR_AREA_UPPER;
			
			// build the ID of the cardelement
			l_strCardDivId = getIdFromExtId(m_objClickedCardParams.upperExtId, 
											l_strArea, 
											GlPairs.C_STR_ID_SUFFIX_CARD_OVERALL);
			
			// get the div element with the ID
			$l_objCardElement = jQuery(l_strCardDivId);
			
			// unregister the click event
			$l_objCardElement.unbind('click');
			// set the cursor back to the default value
			$l_objCardElement.css('cursor', 'auto');

			// build the ID of the second card
			l_strCardDivId = getIdFromExtId(m_objClickedCardParams.lowerExtId, 
											getCorrespondingArea(l_strArea), 
											GlPairs.C_STR_ID_SUFFIX_CARD_OVERALL);
			
			// get the div element with the ID
			$l_objCardElement = jQuery(l_strCardDivId);
			
			// unregister the click event
			$l_objCardElement.unbind('click');
			// set the cursor back to the default value
			$l_objCardElement.css('cursor', 'auto');
		}
	}
	
	/**
	 * Register the events for the end of the turn back transition.
	 * 
	 * @function
	 * @inner
	 * @memberOf GLPairs
	 */
	function setTurnBackEvents() {
		
		// the jQuery object with the first back of the card
		var $l_objCardBackFirst = null;
		// the jQuery object with the second back of the card
		var $l_objCardBackSecond = null;
		// the area of the card
		var l_strArea = '';

		// for the first card it is always the upper area
		l_strArea = GlPairs.C_STR_AREA_UPPER;

		// get the back of the first card
		$l_objCardBackFirst = jQuery(getIdFromExtId(m_objClickedCardParams.upperExtId,
											   l_strArea,
											   GlPairs.C_STR_ID_SUFFIX_BACK));
		
		// register the end event of the turn transition of the back card
		$l_objCardBackFirst.on(
			'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd',
			 function(i_objEvent){
				// call the event handler which delegates the request to the actual handler
				GlPairs.glpairsEventHandler(m_strPairsId, i_objEvent, 'onTurnBackCardEnd', $l_objCardBackFirst);
			 });
		
		// get the back of the second card
		$l_objCardBackSecond = jQuery(getIdFromExtId(m_objClickedCardParams.lowerExtId,
											   		 getCorrespondingArea(l_strArea),
											   		 GlPairs.C_STR_ID_SUFFIX_BACK));
		
		// register the end event of the turn transition of the back card
		$l_objCardBackSecond.on(
			'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd',
			 function(i_objEvent){
				// call the event handler which delegates the request to the actual handler
				GlPairs.glpairsEventHandler(m_strPairsId, i_objEvent, 'onTurnBackCardEnd', $l_objCardBackSecond);
			 });
	}
	
	/**
	 * Turn all cards for the test mode
	 * 
	 * @function
	 * @inner
	 * @memberOf GLPairs
	 */
	function performTestMode() {
		// the ID of the main div element container for this pairs game
		var l_strMainDivId = '';
		// array with all element IDs for the cards
		var l_arrCardIds = [];
		
		l_strMainDivId = getMainDivId();
		
		// select all elements of this pairs container and filter
		// for all overall container elements of the cards
		jQuery(l_strMainDivId).find(".glpairs_cls_click_content").each(
			function(i_intIndex){
				// array with the content element uID and the internal ID
				var l_objElementId = {};
				// the current anchor element
				var $l_objCurrentCardContainer = jQuery(this);

				// get the elements of the ID of this card
				l_objElementId = getIdArrayFromId($l_objCurrentCardContainer.attr('id'));
				
				// push this element to the array
				l_arrCardIds.push(l_objElementId);
			}
		);
		
		// turn all cards from the array
		turnAllCards(l_arrCardIds);
	}

	/**
	 * Turn all cards from the given card id array with a certain delay between every card
	 * 
	 * @function
	 * @inner
	 * @memberOf GLPairs
	 *
	 * @param array	i_arrCardIds	Array with all IDs of the cards	
	 */
	function turnAllCards(i_arrCardIds) {

		// array with the content element uID and the internal ID
		// pairsId:	ID for the content element of the whole pairs game
		// extId:		internal Id of the card
		// area:		weather we are in the lower or upper area
		// suffix:		the suffix of the ID
		var l_objElementId = {};
		
		// exit condition, if the lenght of the array is 0
		if (i_arrCardIds.length === 0) {
			
			// show the test mode hint
			jQuery(getModalHtmlElement(m_objI18n.testmode)).modal();
			
			// exit the function
			return;
		}
		
		// get the first element and cut it from the array
		l_objElementId = i_arrCardIds.shift();
		
		// flip over the card
		flipOverCard(l_objElementId.extId, l_objElementId.area ); 

		// after a timeout turn the next card
		window.setTimeout( function(){turnAllCards(i_arrCardIds);}, 
				m_intTestModeTurnDelay );
	}
	
	/**
	 * Initialize some global properties of the pairs game
	 * 
	 * @function
	 * @inner
	 * @memberOf GLPairs
	 *
	 */
	function initializeGlobals() {
		// build the global status object for all cards in the game
		// initialy thy all in the state backside
		for (var l_intExtId in m_arrExtIdMapping) {
			if(m_arrExtIdMapping.hasOwnProperty(l_intExtId)){
				m_objCardTurnState[l_intExtId] = false;
			}
		}
	}

	/**
	 * Turn a card to the frontside or vice versa
	 * 
	 * @function
	 * @inner
	 * @memberOf GLPairs
	 *
	 * @param integer	i_intExtId	External ID of the card
	 * @param string	i_strArea	Area of the card (upper or lower)	
	 */
	function flipOverCard(i_intExtId, i_strArea ) {
		
		// the jQuery object of the frontside
		var $l_objFrontside = null;
		// the ID of the frontside card
		var l_strCardDivId = ''; 
		
		// build the ID of the cardelement
		l_strCardDivId = getIdFromExtId(i_intExtId, i_strArea, GlPairs.C_STR_ID_SUFFIX_FRONT);
		// get the div element with the ID
		$l_objFrontside = jQuery(l_strCardDivId);
		
		
		// if the frontside is currently shown
		if (m_objCardTurnState[i_intExtId]){

			// toggle the class from invisible to visible for the backside
			toggleClassOfCardElement(i_intExtId, i_strArea, GlPairs.C_STR_ID_SUFFIX_BACK, true);
			// toggle the class from visible to invisible for the frontside
			toggleClassOfCardElement(i_intExtId, i_strArea, GlPairs.C_STR_ID_SUFFIX_FRONT, false);

			// make the frontside invisible
			$l_objFrontside.css('opacity', '0.0');
			$l_objFrontside.css('visibility', 'hidden');

			// set the flag for this card to backside is visible
			m_objCardTurnState[i_intExtId] = false;
		
		// if the backside is currently shown
		} else {

			// make the frontside visible
			$l_objFrontside.css('opacity', '1.0');
			$l_objFrontside.css('visibility', 'visible');

			// toggle the class from visible to invisible for the backside
			toggleClassOfCardElement(i_intExtId, i_strArea, GlPairs.C_STR_ID_SUFFIX_BACK, false);
			// toggle the class from invisible to visible for the frontside
			toggleClassOfCardElement(i_intExtId, i_strArea, GlPairs.C_STR_ID_SUFFIX_FRONT, true);
			
			// set the flag for this card to frontside is visible
			m_objCardTurnState[i_intExtId] = true;
		}
	}
	
	/**
	 * Process all necessary things after the second pair is choosed.
	 * 
	 * @function
	 * @inner
	 * @memberOf GLPairs
	 */
	function afterPairProcessing() {

		// if the correct pair was choosed
		if(m_arrExtIdMapping[m_objClickedCardParams.upperExtId] == 
											m_arrExtIdMapping[m_objClickedCardParams.lowerExtId]){
			// add n plus points
			setResultOfGame(m_intPointsPlus);
			
			// register the events for the end of the turn back transition 
			// if this event is triggered the card getting moved to the card stack
			setTurnBackEvents();
			
			// decrease the pairs count
			m_intPairsCount -= 1;
		}
		
		// if the wrong pair is choosen
		else{
			// set n negative point
			setResultOfGame(-1 * m_intPointsMinus);
		}
				
		// turn the both choosen cards back again
		turnBackCards();
		
		// initialize the global atttribute with the currently chosed cards
		initializeClickedCardParams();
		
		// if the last pair was found
		if (m_intPairsCount === 0) {
			// show the finish dialog after a little delay
			window.setTimeout( function(){gameFinishedDialog();}, 
					    m_intTurnDuration + m_intMoveStackDuration + 200 );
		}
		
	}
	
	/**
	 * Process all necessary things after the second pair is choosed.
	 * 
	 * @function
	 * @inner
	 * @memberOf GLPairs
	 * 
	 * @param 	string i_strExtId	The first extID
	 * @returns	string				The second extID
	 */
	function getCorrespondingExtId(i_strExtId) {
		var l_intUId = 0;
		
		// get the UID of this pair
		l_intUId = m_arrExtIdMapping[i_strExtId];
		
		// if the first extID is not even the current ext ID
		if (i_strExtId != m_arrUidMapping[l_intUId][GlPairs.C_STR_ARR_ID_EXT_ID1])
		{ 
			// the give this extID back
			return m_arrUidMapping[l_intUId][GlPairs.C_STR_ARR_ID_EXT_ID1];
			
		// if it is the other extID
		} else {
			// give this back
			return m_arrUidMapping[l_intUId][GlPairs.C_STR_ARR_ID_EXT_ID2];
		}
	}
	
	/**
	 * Process all necessary things after the second pair is choosed.
	 * 
	 * @function
	 * @inner
	 * @memberOf GLPairs
	 * 
	 * @param 	string i_strArea	The first area
	 * @returns	string				The other area
	 */
	function getCorrespondingArea(i_strArea) {
		
		// if we are in split mode
		if (m_blnSplitmode){
			
			// if this is the upper area
			if(i_strArea == GlPairs.C_STR_AREA_UPPER){
				// return the other
				return GlPairs.C_STR_AREA_LOWER;
			} else {
				return GlPairs.C_STR_AREA_UPPER;
			}
		
		// if we are not in split mode
		} else {
			// we have always upper area
			return GlPairs.C_STR_AREA_UPPER;
		}
	}

	/**
	 * Process all necessary things after the second pair is choosed.
	 * 
	 * @function
	 * @inner
	 * @memberOf GLPairs
	 * 
	 * @param 	{object}	i_objElementId 	Object with four elements
	 * 										pairsId:	ID for the content element of the whole pairs game
	 * 										extId:		internal Id of the card
	 * 										area:		weather we are in the lower or upper area
	 * 										suffix:		the suffix of the ID
	 * 
	 */
	function setCorrespondingChoosedCards(i_objElementId) {
		
		// if this is from the upper area 
		if (i_objElementId.area == GlPairs.C_STR_AREA_UPPER){
			// set the choosed cards there
			m_objClickedCardParams.upperCardChoosed = true;
			m_objClickedCardParams.upperExtId = i_objElementId.extId;
			// and the corresponding cards to the other 
			m_objClickedCardParams.lowerCardChoosed = true;
			m_objClickedCardParams.lowerExtId = getCorrespondingExtId(i_objElementId.extId);
		
		// if this is from the lower area
		} else {
			// set the choosed cards there
			m_objClickedCardParams.lowerCardChoosed = true;
			m_objClickedCardParams.lowerExtId = i_objElementId.extId;
			// and the corresponding cards to the other 
			m_objClickedCardParams.upperCardChoosed = true;
			m_objClickedCardParams.upperExtId = getCorrespondingExtId(i_objElementId.extId);
			
		}
	}
	
	/**
	 * Process all necessary things after the second pair is choosed.
	 * 
	 * @function
	 * @inner
	 * @memberOf GLPairs
	 * 
	 * @param 	{string}	i_strContent 	Content of the modal dialog window
	 */
	function getModalHtmlElement(i_strContent) {
		// build modal window with text
		return [
	    '<div class="modal fade" tabindex="-1" aria-hidden="true" id="thulinModal">',
	      '<div class="modal-dialog">',
	        '<div class="modal-content">',
	        	'<div class="modal-body">',
	        		'<p>',
	        			i_strContent,
	        		'</p>',
	        	'</div>',
				'<div class="modal-footer">',
	        		'<button type="button" class="btn btn-primary"', 
	          				'data-bs-dismiss="modal">OK</button>',
	      		'</div>',          
	        '</div>',
	      '</div>',
	    '</div>'  
		].join('\n');		
	}
	
	/**
	 * Process all necessary things after the second pair is choosed.
	 * 
	 * @function
	 * @inner
	 * @memberOf GLPairs
	 * 
	 * @param 	{string}	i_strContent 	Content of the modal dialog window
	 * @param 	{string}	i_strImages 	Image data of the modal dialog window
	 * @param	{integer}	i_intHeight		Height of the modal window
	 * @param	{integer}	i_intWidth		Width of the modal window
	 */
	function getModalHtmlElementFinalInformation(i_strContent, i_strImages,
												 i_intHeight, i_intWidth) {
		// size of the window
		var l_strSize = "";
		// height of the window
		var l_strHeight = "";
		// width of the window
		var l_strWidth = "";

		// if a height is given
		if(i_intHeight !== 0){
			l_strHeight = "height: " + i_intHeight + "px;";
		}
		
		// if a width is given
		if(i_intWidth !== 0){
			l_strWidth = "width: " + i_intWidth + "px;";
		}
		
		// if there is a size given at all
		if(i_intHeight !== 0 || i_intWidth !== 0){
			// build the style tag
			l_strSize = 'style="' + l_strHeight + ' ' + l_strWidth + '"';
		}
		
		return [
			'<div id="modalwindow" class="modal fade" role="dialog"',
			  l_strSize,
			  '>',
			  '<div class="modal-dialog" role="document">',
			    '<div class="modal-content"',
			    l_strSize,
			    '>',
			      '<div class="modal-body">',
			        '<div>',
			          i_strImages,
			        '</div>',
			        '<div>',
			          i_strContent,
			        '</div>',
			      '</div>',
			      '<div class="modal-footer">',
			        '<button type="button" class="btn btn-default"',
			          'data-bs-dismiss="modal">OK</button>',
			      '</div>',
			    '</div>',
			  '</div>',
			'</div>',
		   ].join('\n');
	}
}

// ***************************************************************/
// Constants of the glpairs class
// ***************************************************************/

// The name of the Identifiery of the Mapping array for external ID 1
GlPairs.C_STR_ARR_ID_EXT_ID1 = 'extID1';
// The name of the Identifiery of the Mapping array for external ID 2
GlPairs.C_STR_ARR_ID_EXT_ID2 = 'extID2';

// the Pairstype for the same image 
GlPairs.C_INT_PAIRS_TYPE_SamePic = 0;
//the Pairstype for two similar images
GlPairs.C_INT_PAIRS_TYPE_2Pic = 1;
//the Pairstype for the image and text pair
GlPairs.C_INT_PAIRS_TYPE_PicText = 2;
//the Pairstype for the text only type
GlPairs.C_INT_PAIRS_TYPE_TextOnly = 3;

// the identifier of the upper area
GlPairs.C_STR_AREA_UPPER = 'upper';
//the identifier of the lower area
GlPairs.C_STR_AREA_LOWER = 'lower';

// the default class of the border from a card
GlPairs.C_STR_CARD_BORDER_CLASS_DEFAULT = 'glpairs_cls_card_border';
//the wrong class of the border from a card
GlPairs.C_STR_CARD_BORDER_CLASS_WRONG = 'glpairs_cls_card_border_wrong';
//the right class of the border from a card
GlPairs.C_STR_CARD_BORDER_CLASS_RIGHT = 'glpairs_cls_card_border_right';

// identifier for the ID suffix of the front card
GlPairs.C_STR_ID_SUFFIX_FRONT = 'div_card_front';
//identifier for the ID suffix of the back card
GlPairs.C_STR_ID_SUFFIX_BACK = 'div_card_back';
//identifier for the ID suffix of the result element
GlPairs.C_STR_ID_SUFFIX_RESULT = 'glpairs_result';
//identifier for the ID suffix of the border element
GlPairs.C_STR_ID_SUFFIX_FRONT_CARD = 'front_card';
//identifier for the ID suffix of the TD element which contains the whole card data
GlPairs.C_STR_ID_SUFFIX_TD_CONTAINER = 'td_card';
//identifier for the ID suffix of the div element from the front card
GlPairs.C_STR_ID_SUFFIX_TD_CONTAINER = 'td_card';
//identifier for the ID suffix of the card stack
GlPairs.C_STR_ID_SUFFIX_CARD_STACK = 'glpairs_card_stack';
//identifier for the ID suffix of the container for the whole card
GlPairs.C_STR_ID_SUFFIX_CARD_OVERALL = 'overall_card';
//identifier for the ID suffix of the img of the back card
GlPairs.C_STR_ID_SUFFIX_IMG_BACK = 'img_back';
//identifier for the ID suffix of the ckick hint box
GlPairs.C_STR_ID_SUFFIX_CLICK_HINT = 'glpairs_click_hint';


// ***************************************************************/
// Static attributes of the glpairs class
// ***************************************************************/

//static array with all pairs objects of the current page
GlPairs.arrPairs = [];

// ***************************************************************/
// Static method/function part
// ***************************************************************/

/**
 * The main init method which is starting all pairs games of the current page
 *
 * @function
 * @memberOf GLPairs
 * @param {array} i_arrPairsUniqueIds	Array with all unique IDs of the 
 * 										pairs games which should be started.
*/
GlPairs.glpairsInit = function(i_arrPairsUniqueIds) {
	// turn on the strict mode
	"use strict";
	// for every unique ID
	jQuery.each(i_arrPairsUniqueIds,
		function(i_intIndex, i_strUniqueId){
			var objPairs = new GlPairs(i_strUniqueId);
			
			// start initial ajax request
			objPairs.requestAjaxGeneralPairsData();
		}
	);	
};

/**
 * static handler for Ajax response
 * 
 * @function
 * @memberOf GLPairs
 * @param {String} i_strResponseFunc	Function to be called for handling the ajax request.
 * @param {Object} i_jsonResult			Json container with all the received data.
 */
GlPairs.glpairsHandleAjaxResponse = function(i_strResponseFunc, i_jsonResult) {
	// turn on the strict mode
	"use strict";
	
	// get the corresponding pairs game object
	var objPairs = GlPairs.arrPairs[i_jsonResult.strUniqueId];
	
	// unset ajax mode
	objPairs.setAjaxWaitParams(false);

	// call the specific method which handle the ajax response
	objPairs[i_strResponseFunc](i_jsonResult);
};

/**
 * static handler for the events
 * 
 * @function
 * @memberOf GLPairs
 * @param {integer} i_intUniqueId 			Unique ID of the pairs game. 
 * @param {Object} 	i_objEvent				Event object.
 * @param {String}	i_strHandler			Name of the Method which processing the event request.	
 * @param {Object}	$i_objCurrentElement	jQuery object this is the element which has received the event.
 */
GlPairs.glpairsEventHandler = function(i_intUniqueId, i_objEvent, i_strHandler, $i_objCurrentElement ) {
	// turn on the strict mode
	"use strict";
	// get the corresponding pairs game object
	var objPairs = GlPairs.arrPairs[i_intUniqueId];

	// call the actual event handler
	objPairs[i_strHandler](i_objEvent, $i_objCurrentElement);
};


//**************************************************************************************** //
//**************************************************************************************** //
// finally start the glpairs plugin for all IDs stored globaly in the array arrGlpairsIds
// if document ready, call the init function of the game
if(typeof arrGlpairsIds !== 'undefined') {
	GlPairs.glpairsInit(arrGlpairsIds);
}
//**************************************************************************************** //
//**************************************************************************************** //
