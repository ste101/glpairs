<?php
if (!defined('TYPO3')) {
    die('Do not access the file tx_glpairs_domain_model_pairs.php directly.');
}

$tx_glpairs_domain_model_pairs = [
    'ctrl' => [
        'title'	=> 'LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model_pairs',
        'label' => 'name',
        'tstamp' => 'tstamp',
        'crdate' => 'crdate',
        'dividers2tabs' => TRUE,
        'origUid' => 't3_origuid',
        'languageField' => 'sys_language_uid',
        'transOrigPointerField' => 'l10n_parent',
        'transOrigDiffSourceField' => 'l10n_diffsource',
        'delete' => 'deleted',
        'type' => 'type',
        'enablecolumns' => [
            'disabled' => 'hidden',
            'starttime' => 'starttime',
            'endtime' => 'endtime',
        ],
        'searchFields' => 'name,type,width,has_pairs,',
        'iconfile' => 'EXT:glpairs/Resources/Public/Icons/tx_glpairs_domain_model_pairs.gif',
		'security' => [
            'ignorePageTypeRestriction' => true,
        ],
	],
	'types' => [
	    '0' => ['showitem' => 'sys_language_uid, l10n_parent, l10n_diffsource, hidden, --palette--;;1, type, name, splitmode, width, bordersize, cardheight, cardwidth, pluspoints, minuspoints, backimage, custom_backimage1, custom_backimage2, maxcards, has_pairs, 
									--div--;LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model.tabfinalinfo, finaltextwidth, finaltextheight, finalpicwidth, finalpicheight,
									--div--;LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model.tabadvanced, turnbackdelay, hintdelay, turnduration, stackduration, testmodeturndelay, testmode,
									--div--;LLL:EXT:core/Resources/Private/Language/locallang_tca.xlf:be_users.tabs.access,starttime, endtime'
				],
	    '1' => ['showitem' => 'sys_language_uid, l10n_parent, l10n_diffsource, hidden, --palette--;;1, type, name, splitmode, width, bordersize, cardheight, cardwidth, pluspoints, minuspoints, backimage, custom_backimage1, custom_backimage2, maxcards, has_pairs,
									--div--;LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model.tabfinalinfo, finaltextwidth, finaltextheight, finalpicwidth, finalpicheight,
									--div--;LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model.tabadvanced, turnbackdelay, hintdelay, turnduration, stackduration, testmodeturndelay, testmode,
									--div--;LLL:EXT:core/Resources/Private/Language/locallang_tca.xlf:be_users.tabs.access,starttime, endtime'
				],
	    '2' => ['showitem' => 'sys_language_uid, l10n_parent, l10n_diffsource, hidden, --palette--;;1, type, name, splitmode, width, bordersize, cardheight, cardwidth, fontsize, pluspoints, minuspoints, backimage, custom_backimage1, custom_backimage2, maxcards, has_pairs,
									--div--;LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model.tabfinalinfo, finaltextwidth, finaltextheight, finalpicwidth, finalpicheight,
									--div--;LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model.tabadvanced, turnbackdelay, hintdelay, turnduration, stackduration, testmodeturndelay, testmode,
									--div--;LLL:EXT:core/Resources/Private/Language/locallang_tca.xlf:be_users.tabs.access,starttime, endtime'
				],
	    '3' => ['showitem' => 'sys_language_uid, l10n_parent, l10n_diffsource, hidden, --palette--;;1, type, name, splitmode, width, bordersize, cardheight, cardwidth, fontsize, pluspoints, minuspoints, backimage, custom_backimage1, custom_backimage2, maxcards, has_pairs,
									--div--;LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model.tabfinalinfo, finaltextwidth, finaltextheight, finalpicwidth, finalpicheight,
									--div--;LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model.tabadvanced, turnbackdelay, hintdelay, turnduration, stackduration, testmodeturndelay, testmode,
									--div--;LLL:EXT:core/Resources/Private/Language/locallang_tca.xlf:be_users.tabs.access, endtime'
				],
	],
	'palettes' => [
		'1' => ['showitem' => ''],
	],
	'columns' => [
		'sys_language_uid' => [
			'exclude' => 1,
			'label' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.language',
		    'config' => [
		        'type'       => 'language',
		    ],
		],

	    'l10n_parent' => [
			'displayCond' => 'FIELD:sys_language_uid:>:0',
			'label' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.l18n_parent',
			'config' => [
				'type' => 'select',
				'items' => [
					[
						'label' => '',
						'value' => 0
					],
				],
				'foreign_table' => 'tx_glpairs_domain_model_pairs',
				'foreign_table_where' => 'AND tx_glpairs_domain_model_pairs.pid=###CURRENT_PID### AND tx_glpairs_domain_model_pairs.sys_language_uid IN (-1,0)',
				'renderType' => 'selectSingle',
			],
		],
		'l10n_diffsource' => [
			'config' => [
				'type' => 'passthrough',
			],
		],
		't3ver_label' => [
			'label' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.versionLabel',
			'config' => [
				'type' => 'input',
				'size' => 30,
				'max' => 255,
			]
		],
		'hidden' => [
			'exclude' => 1,
			'label' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.hidden',
			'config' => [
				'type' => 'check',
			],
		],
		'starttime' => [
			'exclude' => 1,
			'label' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.starttime',
			'config' => [
				'type' => 'datetime',
				'default' => 0,
			    'behaviour' => [
			        'allowLanguageSynchronization' => true
			    ],
			],
		],
		'endtime' => [
			'exclude' => 1,
			'label' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.endtime',
			'config' => [
				'type' => 'datetime',
				'default' => 0,
			    'behaviour' => [
			        'allowLanguageSynchronization' => true
			    ],
			],
		],
		'name' => [
			'exclude' => 0,
			'label' => 'LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model_pairs.name',
			'config' => [
				'type' => 'input',
				'size' => 30,
				'required' => true,
				'trim' => true
			],
		],
		'type' => [
			'exclude' => 0,
			'label' => 'LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model_pairs.type',
			'config' => [
				'type' => 'select',
			    'items' => 	[
			    				[
			    					'label' => 'LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model.type.same',
			    					'value' => 0
			    				],
			    				[
			    					'label' => 'LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model.type.2pics',
			    					'value' => 1
			    				],
			    				[
			    					'label' => 'LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model.type.text',
			    					'value' => 2
			    				],
			    				[
			    					'label' => 'LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model.type.textonly',
			    					'value' => 3
			    				]
			    			],
				'size' => 1,
				'maxitems' => 1,
				'required' => true,
				'default' => 0,
				'renderType' => 'selectSingle',
			],
		],
		'splitmode' => [
			'exclude' => 1,
			'label' => 'LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model_pairs.splitmode',
			'config' => [
				'type' => 'check',
			],
		],
		'width' => [
			'exclude' => 0,
			'label' => 'LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model_pairs.width',
			'config' => [
				'type' => 'number',
				'size' => 4,
				'required' => true,
				'default' => 5,
				'range' => [
							  'lower' => 1,
							  'upper' => 9999
							]
			],
		],
		'bordersize' => [
			'exclude' => 0,
			'label' => 'LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model_pairs.bordersize',
			'config' => [
				'type' => 'number',
				'size' => 4,
				'required' => true,
				'default' => 3,
				'range' => [
							  'lower' => 0,
							  'upper' => 9999
							]
			],
		],
		'cardheight' => [
			'exclude' => 0,
			'label' => 'LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model_pairs.cardheight',
			'config' => [
				'type' => 'number',
				'size' => 4,
			    'default' => 0
			],
		],
		'cardwidth' => [
			'exclude' => 0,
			'label' => 'LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model_pairs.cardwidth',
			'config' => [
				'type' => 'number',
				'size' => 4,
			    'default' => 0
			],
		], 
		'fontsize' => [
			'exclude' => 0,
			'label' => 'LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model_pairs.fontsize',
			'config' => [
				'type' => 'number',
				'size' => 4,
			    'default' => 0
			],
		], 
		'pluspoints' => [
			'exclude' => 0,
			'label' => 'LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model_pairs.pluspoints',
			'config' => [
				'type' => 'number',
				'size' => 4,
				'required' => true,
				'default' => 5,
				'range' => [
							  'lower' => 0,
							  'upper' => 9999
							]
			],
		],
		'minuspoints' => [
			'exclude' => 0,
			'label' => 'LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model_pairs.minuspoints',
			'config' => [
				'type' => 'number',
				'size' => 4,
				'required' => true,
				'default' => 1,
				'range' => [
							  'lower' => 0,
							  'upper' => 9999
							]
			],
		],
		'backimage' => [
			'exclude' => 0,
		    'onChange' => 'reload',
			'label' => 'LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model_pairs.backimage',
			'config' => [
				'type' => 'select',
			    'items' => 	[
			    				[
			    					'label' => 'LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model_pairs.backimage.red',
			    					'value' => 0
			    				],
			    				[
			    					'label' => 'LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model_pairs.backimage.blue',
			    					'value' => 1
			    				],
			    				[
			    					'label' => 'LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model_pairs.backimage.mixed',
			    					'value' => 2
			    				],
            			        [
            			        	'label' => 'LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model_pairs.backimage.custom',
            			        	'value' => 3
            			        ]
            			    ],
				'size' => 1,
				'maxitems' => 1,
				'required' => true,
				'default' => 0,
				'renderType' => 'selectSingle',
			],
		],
	    'custom_backimage1' => [
	        'exclude' => 0,
	        'displayCond' => 'FIELD:backimage:=:3',
	        'label' => 'LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model_pairs.customBackimage1',
            'config' => [
                'type' => 'file',
                'maxitems' => 1,
                'minitems' => 1,
                'allowed' => $GLOBALS['TYPO3_CONF_VARS']['GFX']['imagefile_ext'],
                'appearance' => [
                    'createNewRelationLinkTitle' => 'LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:images.addFileReference'
                ],
                'overrideChildTca' => [
                    'types' => [
                        '0' => [
                            'showitem' => '
                                --palette--;LLL:EXT:core/locallang_tca.xlf:sys_file_reference.imageoverlayPalette;imageoverlayPalette,
                                --palette--;;filePalette'
                        ],
                    ],
                ],
            ],
	    ],
	    'custom_backimage2' => [
	        'exclude' => 0,
	        'displayCond' => [
                    'AND' => [
                        'FIELD:backimage:=:3',
                        'FIELD:type:=:1',
                    ],
                ],
	        'label' => 'LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model_pairs.customBackimage2',
	        'config' => [
	            'type' => 'file',
	            'maxitems' => 1,
	            'minitems' => 1,
	            'allowed' => $GLOBALS['TYPO3_CONF_VARS']['GFX']['imagefile_ext'],
	            'appearance' => [
	                'createNewRelationLinkTitle' => 'LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:images.addFileReference'
	            ],
	            'overrideChildTca' => [
	                'types' => [
	                    '0' => [
	                        'showitem' => '
	                            --palette--;LLL:EXT:core/locallang_tca.xlf:sys_file_reference.imageoverlayPalette;imageoverlayPalette,
	                            --palette--;;filePalette'
	                    ],
	                ],
	            ],
	        ],
	    ],
	    'turnbackdelay' => [
			'exclude' => 0,
			'label' => 'LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model_pairs.turnbackdelay',
			'config' => [
				'type' => 'number',
				'size' => 4,
				'required' => true,
				'default' => 20000,
				'range' => [
							  'lower' => 0,
							  'upper' => 999999
							]
			],
		],
		'hintdelay' => [
				'exclude' => 0,
				'label' => 'LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model_pairs.hintdelay',
				'config' => [
						'type' => 'number',
						'size' => 4,
						'required' => true,
						'default' => 10000,
						'range' => [
								'lower' => 0,
								'upper' => 999999
						]
				],
		],
		'turnduration' => [
				'exclude' => 0,
				'label' => 'LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model_pairs.turnduration',
				'config' => [
						'type' => 'number',
						'size' => 4,
						'required' => true,
						'default' => 500,
						'range' => [
								'lower' => 0,
								'upper' => 999999
						]
				],
		],
		'stackduration' => [
				'exclude' => 0,
				'label' => 'LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model_pairs.stackduration',
				'config' => [
						'type' => 'number',
						'size' => 4,
						'required' => true,
						'default' => 500,
						'range' => [
								'lower' => 0,
								'upper' => 999999
						]
				],
		],
		'testmodeturndelay' => [
				'exclude' => 0,
				'label' => 'LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model_pairs.testmodeturndelay',
				'config' => [
						'type' => 'number',
						'size' => 4,
						'required' => true,
						'default' => 100,
						'range' => [
								'lower' => 0,
								'upper' => 999999
						]
				],
		],
		'testmode' => [
			'exclude' => 1,
			'label' => 'LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model_pairs.testmode',
			'config' => [
				'type' => 'check',
			],
		],
		'maxcards' => [
				'exclude' => 0,
				'label' => 'LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model_pairs.maxcards',
				'config' => [
						'type' => 'number',
						'size' => 4,
						'default' => 500,
						'range' => [
								'lower' => 0,
								'upper' => 999999
						]
				],
		],
		'has_pairs' => [
			'exclude' => 0,
			'label' => 'LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model_pairs.has_pairs',
			'config' => [
				'type' => 'select',
				'foreign_table' => 'tx_glpairs_domain_model_pair',
				'foreign_table_where' => 'AND {#tx_glpairs_domain_model_pair}.{#type}=###REC_FIELD_type###',
				'MM' => 'tx_glpairs_pairs_pair_mm',
				'size' => 10,
				'autoSizeMax' => 30,
				'maxitems' => 9999,
				'minitems' => 0,
				'multiple' => 0,
				'renderType' => 'selectMultipleSideBySide',
			    'default' => 0
			],
		],
		'finaltextwidth' => [
				'exclude' => 0,
				'label' => 'LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model_pairs.finaltextwidth',
				'config' => [
					'type' => 'number',
					'size' => 4,
				    'default' => 0
				],
		],
		'finaltextheight' => [
				'exclude' => 0,
				'label' => 'LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model_pairs.finaltextheight',
				'config' => [
					'type' => 'number',
					'size' => 4,
				    'default' => 0
				],
		],
		'finalpicwidth' => [
				'exclude' => 0,
				'label' => 'LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model_pairs.finalpic_width',
				'config' => [
					'type' => 'number',
					'size' => 4,
				    'default' => 0
				],
		],
		'finalpicheight' => [
				'exclude' => 0,
				'label' => 'LLL:EXT:glpairs/Resources/Private/Language/locallang_db.xlf:tx_glpairs_domain_model_pairs.finalpic_height',
				'config' => [
					'type' => 'number',
					'size' => 4,
				    'default' => 0
				],
		],
				
	],
];

return $tx_glpairs_domain_model_pairs;
?>
