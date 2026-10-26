function generatePDF(formData, recordId, form) {

    const doc = new PDFDocument({
        size: 'LETTER',
        margins: {
            top: 100,
            bottom: 75,
            left: 50,
            right: 50
        }
    });

    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));

    doc.on('end', () => {
        const blob = new Blob(chunks, {
            type: 'application/pdf'
        });

        window.open(URL.createObjectURL(blob), '_blank');
    });

    // Header and footer
    addHeader(doc);
    // addFooter(doc, 1);

    // Start content below the header
    doc.x = 50;
    doc.y = 100;


    // Decision closure content
    createPDFDecisionClosure(doc, formData);
    
    createPDFAcceptedConsequence(doc, formData)

    createPDFConditionsTable(doc, formData, form);

    createPDFDecisionBasis(doc, formData);



    doc.end();
}



function createPDFDecisionClosure(doc, formData = {}) {

    // =====================================================
    // FORM DATA
    // =====================================================

    const dealReference = formData.get('dealReference') || 'Not provided';
    const propertyIdentifier = formData.get('propertyIdentifier') || 'Not provided';
    const capitalEvent = formData.get('capitalEvent') || 'Not provided';
    const decisionDate = formData.get('date') || 'Not provided';
    const fundingDate = formData.get('fundingDate') || 'Not provided';
    const decisionOwner = formData.get('decisionOwner') || 'Not provided';
    const approvalAuthority = formData.get('approvalAuthority') || 'Not provided';

    // =====================================================
    // TITLE
    // =====================================================

    doc
        .font('Helvetica-Bold')
        .fontSize(20)
        .fillColor('#222222')
        .text('Decision Closure Record');

    doc.moveDown(0.4);

    doc
        .font('Helvetica-Oblique')
        .fontSize(9)
        .fillColor('#666666')
        .text('Stage 1');

    doc.moveDown(1.5);


    // =====================================================
    // DECISION STATUS
    // =====================================================

    // Keep this hardcoded for now.
    // We can connect it to the final decision posture later.

    const proposedAction = formData.get('proposedAction') || 'Not selected';

    const actionLabels = {
        advance: 'ADVANCE',
        modify: 'MODIFY',
        defer: 'DEFER',
        decline: 'DECLINE'
    };

    doc
        .font('Helvetica-Bold')
        .fontSize(14)
        .fillColor('#222222')
        .text(`CLOSED DECISION: ${actionLabels[proposedAction] || proposedAction.toUpperCase()}`);

    doc.moveDown(1);


    // =====================================================
    // FORMAT HELPERS
    // =====================================================

    function formatDate(value) {

        if (!value) {
            return 'Not provided';
        }

        // HTML date inputs return YYYY-MM-DD.
        const parts = value.split('-');

        if (parts.length !== 3) {
            return value;
        }

        const date = new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        );

        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    }

    function getCapitalEventLabel(value) {

        const labels = {
            'acquisition': 'Acquisition',
            'refinance': 'Refinance',
            'recapitalization': 'Recapitalization',
            'major-capital': 'Major capital',
            'disposition': 'Disposition',
            'other': 'Other'
        };

        return labels[value] || value || 'Not provided';
    }


    // =====================================================
    // TABLE DATA
    // =====================================================

    const tableX = 50;
    const tableWidth = 512;

    const detailWidth = 200;
    const valueWidth = tableWidth - detailWidth;

    const headerHeight = 32;

   const rows = [
    ['Transaction', dealReference],
    ['Property / identifier', propertyIdentifier],
    ['Capital event', getCapitalEventLabel(capitalEvent)],
    ['Decision date', formatDate(decisionDate)],
    ['Expected funding date', formatDate(fundingDate)],
    ['Decision owner', decisionOwner],
    ['Approval authority', approvalAuthority],
    [
        'Closure record',
        'DC-EXAMPLE-001 | Closed September 17, 2026 at 3:30 PM UTC'
    ]
];


    // =====================================================
    // FONT AND ROW SETTINGS
    // =====================================================

    const headerFontSize = 14;
    const bodyFontSize = 12;

    const rowLineHeight = 12;
    const minimumRowHeight = rowLineHeight * 2;

    doc
        .font('Helvetica')
        .fontSize(bodyFontSize);

    const rowHeights = rows.map(row => {

        const labelHeight = doc.heightOfString(row[0] || '', {
            width: detailWidth - 20,
            lineGap: 0
        });

        const valueHeight = doc.heightOfString(row[1] || '', {
            width: valueWidth - 20,
            lineGap: 0
        });

        return Math.max(
            minimumRowHeight,
            labelHeight,
            valueHeight
        ) + 8;

    });


    // =====================================================
    // TABLE HEADER
    // =====================================================

    const headerY = doc.y;

    doc
        .fillColor('#E6E6E6')
        .rect(tableX, headerY, detailWidth, headerHeight)
        .fill();

    doc
        .rect(
            tableX + detailWidth,
            headerY,
            valueWidth,
            headerHeight
        )
        .fill();

    doc
        .strokeColor('#104E75')
        .lineWidth(1)
        .rect(tableX, headerY, detailWidth, headerHeight)
        .stroke();

    doc
        .rect(
            tableX + detailWidth,
            headerY,
            valueWidth,
            headerHeight
        )
        .stroke();

    doc
        .fillColor('#000000')
        .font('Helvetica-Bold')
        .fontSize(headerFontSize)
        .text(
            'Decision Details',
            tableX + 10,
            headerY + 10,
            {
                width: detailWidth - 20
            }
        )
        .text(
            'Recorded value',
            tableX + detailWidth + 10,
            headerY + 10,
            {
                width: valueWidth - 20
            }
        );


    // =====================================================
    // TABLE ROWS
    // =====================================================

    let currentY = headerY + headerHeight;

    rows.forEach((row, index) => {

        const rowHeight = rowHeights[index];

        const x1 = tableX;
        const x2 = tableX + detailWidth;

        // Cell backgrounds
        doc
            .fillColor('#FFFFFF')
            .rect(x1, currentY, detailWidth, rowHeight)
            .fill();

        doc
            .rect(x2, currentY, valueWidth, rowHeight)
            .fill();

        // Cell borders
        doc
            .strokeColor('#104E75')
            .lineWidth(1)
            .rect(x1, currentY, detailWidth, rowHeight)
            .stroke();

        doc
            .rect(x2, currentY, valueWidth, rowHeight)
            .stroke();

        // Cell text
        doc
            .fillColor('#000000')
            .font('Helvetica')
            .fontSize(bodyFontSize)
            .text(
                row[0],
                x1 + 10,
                currentY + 6,
                {
                    width: detailWidth - 20,
                    lineGap: 0
                }
            )
            .text(
                row[1],
                x2 + 10,
                currentY + 6,
                {
                    width: valueWidth - 20,
                    lineGap: 0
                }
            );

        currentY += rowHeight;

    });


    // =====================================================
    // CLEANUP
    // =====================================================

    doc.y = currentY;

    doc
        .fillColor('#000000')
        .strokeColor('#000000')
        .font('Helvetica')
        .fontSize(12);

    doc.moveDown(1);

}


function addHeader(doc) {
    doc.save();

    // Logo
    doc
        .rect(50, 30, 35, 35)
        .fill('#1470af');

    doc
        .fillColor('#FFFFFF')
        .font('Helvetica-Bold')
        .fontSize(22)
        .text('W', 50, 35, {
            width: 35,
            height: 25,
            align: 'center',
            lineBreak: false
        });

    // Header title
    doc
        .fillColor('#000000')
        .font('Helvetica-Bold')
        .fontSize(18)
        .text('Deal Killers', 100, 30, {
            width: 412,
            height: 22,
            align: 'center',
            lineBreak: false
        });

    // Header line
    doc
        .moveTo(100, 55)
        .lineTo(512, 55)
        .lineWidth(1)
        .strokeColor('#1470af')
        .stroke();

    // Header subtitle
    doc
        .font('Helvetica-Oblique')
        .fontSize(9)
        .fillColor('#555555')
        .text('an analysis tool from John', 100, 60, {
            width: 412,
            height: 12,
            align: 'center',
            lineBreak: false
        });

    doc.restore();
}


function addFooter(doc, pageNumber = 1) {

    const pageWidth = 612;
    const pageHeight = 792;

    doc.save();

    // Footer divider
    doc
        .moveTo(50, pageHeight - 55)
        .lineTo(pageWidth - 50, pageHeight - 55)
        .lineWidth(0.75)
        .strokeColor('#1470af')
        .stroke();

    // Footer label
    doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor('#777777')
        .text(
            'Deal Killers | Professional Decision-Support Tool',
            50,
            pageHeight - 43,
            {
                width: 400,
                lineBreak: false
            }
        );

    // Page number
    doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor('#777777')
        .text(
            `Page ${pageNumber}`,
            450,
            pageHeight - 43,
            {
                width: 112,
                align: 'right',
                lineBreak: false
            }
        );

    doc.restore();
}


function createPDFAcceptedConsequence(doc, formData) {

    // =====================================================
    // FORM DATA
    // =====================================================

    const consequenceStatement =
        formData.get('consequenceStatement') || 'Not provided';

    const materialEvidence =
        formData.get('materialEvidence') || 'Not provided';

    const acceptedRisks = formData.getAll('acceptedRisks[]')
        .map(value => value.trim())
        .filter(Boolean);

    const recoveryNotApplicable =
        formData.get('recoveryNotApplicable') === 'yes';

    const recoveryPlan = recoveryNotApplicable
        ? 'Recovery is not applicable.'
        : formData.get('recoveryPlan') || 'Not provided';

    const noAssumptionsIdentified =
        formData.get('noAssumptionsIdentified') === 'yes';

    const keyAssumptions = formData.getAll('keyAssumptions[]')
        .map(value => value.trim())
        .filter(Boolean);


    // =====================================================
    // SECTION DATA
    // =====================================================

    const sections = [
        {
            heading: 'ACCEPTED CONSEQUENCE',
            body: consequenceStatement
        },
        {
            heading: 'Evidence relied upon',
            body: materialEvidence
        },
        {
            heading: 'Accepted risks',
            body: acceptedRisks.length
                ? acceptedRisks.join('\n\n')
                : 'Not provided'
        },
        {
            heading: 'Recovery and containment',
            body: recoveryPlan
        },
        {
            heading: 'Key assumptions',
            body: noAssumptionsIdentified
                ? 'None identified.'
                : keyAssumptions.length
                    ? keyAssumptions.join('\n\n')
                    : 'Not provided'
        }
    ];


    // =====================================================
    // LAYOUT SETTINGS
    // =====================================================

    const leftMargin = 50;
    const contentWidth = 512;
    const headingFontSize = 14;
    const bodyFontSize = 12;
    const sectionSpacing = 16;


    // =====================================================
    // CREATE SECTIONS
    // =====================================================

    sections.forEach(function (section) {

        // Section heading
        doc
            .font('Helvetica-Bold')
            .fontSize(headingFontSize)
            .fillColor('#000000')
            .text(section.heading, leftMargin, doc.y, {
                width: contentWidth
            });

        doc.moveDown(0.4);

        // Section body
        doc
            .font('Helvetica')
            .fontSize(bodyFontSize)
            .fillColor('#000000')
            .text(section.body, leftMargin, doc.y, {
                width: contentWidth,
                lineGap: 2,
                paragraphGap: 0
            });

        // Space before next section
        doc.y += sectionSpacing;
    });


    // =====================================================
    // RESET FORMATTING
    // =====================================================

    doc
        .font('Helvetica')
        .fontSize(12)
        .fillColor('#000000');

}



function createPDFConditionsTable(doc, formData, form) {
    const conditionCards = Array.from(
        form.querySelectorAll('[data-condition-card]')
    );

    const tableX = 50;
    const tableWidth = 512;
    const labelWidth = 155;
    const detailWidth = tableWidth - labelWidth;
    const padding = 9;

    const timingLabels = {
        'pre-commitment': 'Pre-commitment',
        'pre-funding': 'Pre-funding',
        'monitoring': 'Monitoring',
        'accepted-exception': 'Accepted exception'
    };

    const statusLabels = {
        open: 'Open',
        satisfied: 'Satisfied',
        waived: 'Waived',
        failed: 'Failed',
        changed: 'Changed'
    };

    const getFieldValue = (card, fieldName) => {
        const field = card.querySelector(
            `[data-field="${fieldName}"]`
        );

        if (!field) return '';

        if (field.type === 'radio') {
            const selected = card.querySelector(
                `[data-field="${fieldName}"]:checked`
            );

            return selected ? selected.value : '';
        }

        return field.value.trim();
    };

    const formatDate = (value) => {
        if (!value) return 'Not provided';

        const parts = value.split('-');

        if (parts.length !== 3) return value;

        const date = new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        );

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const conditions = conditionCards.map((card, index) => ({
        id: `C${index + 1}`,
        timing: getFieldValue(card, 'timing'),
        status: getFieldValue(card, 'status') || 'open',
        condition: getFieldValue(card, 'condition'),
        owner: getFieldValue(card, 'owner'),
        dueDate: getFieldValue(card, 'dueDate'),
        waiverScope: getFieldValue(card, 'waiverScope'),
        evidence: getFieldValue(card, 'evidence')
    }));

    const countStatus = (status) =>
        conditions.filter(condition => condition.status === status).length;

    const acceptedExceptions = conditions.filter(
        condition => condition.timing === 'accepted-exception'
    ).length;

    // Section heading
    doc.moveDown(1);

    doc.font('Helvetica-Bold')
        .fontSize(16)
        .fillColor('#222222')
        .text('Conditions Register', 50, doc.y, {
            width: tableWidth
        });

    doc.moveDown(0.5);

    doc.font('Helvetica')
        .fontSize(10)
        .fillColor('#555555')
        .text(
            'Closed requirements and their assigned responsibility, evidence, and status.',
            50,
            doc.y,
            { width: tableWidth }
        );

    doc.moveDown(1);

    // Summary
    doc.font('Helvetica-Bold')
        .fontSize(11)
        .fillColor('#222222')
        .text('Condition Summary', 50, doc.y, {
            width: tableWidth
        });

    doc.moveDown(0.35);

    doc.font('Helvetica')
        .fontSize(10)
        .text(
            [
                `Total conditions: ${conditions.length}`,
                `Open: ${countStatus('open')}`,
                `Satisfied: ${countStatus('satisfied')}`,
                `Waived: ${countStatus('waived')}`,
                `Failed: ${countStatus('failed')}`,
                `Changed: ${countStatus('changed')}`,
                `Accepted exceptions: ${acceptedExceptions}`
            ].join('\n'),
            50,
            doc.y,
            {
                width: tableWidth,
                lineGap: 3
            }
        );

    doc.moveDown(1);

    if (conditions.length === 0) {
        doc.font('Helvetica-Oblique')
            .fontSize(10)
            .fillColor('#555555')
            .text('No conditions were recorded.', 50, doc.y, {
                width: tableWidth
            });

        doc.fillColor('#000000');
        return;
    }

    // Draw each condition
    conditions.forEach((condition) => {
        const timingLabel =
            timingLabels[condition.timing] || 'Not specified';

        const statusLabel =
            statusLabels[condition.status] || condition.status;

        const leftText = [
            condition.id,
            timingLabel,
            statusLabel
        ].join('\n');

        const rightText = [
            `Condition: ${condition.condition || 'Not provided'}`,
            `Owner: ${condition.owner || 'Not provided'}`,
            `Due: ${formatDate(condition.dueDate)}`,
            `Evidence: ${condition.evidence || 'Not provided'}`,
            `Waiver scope: ${condition.waiverScope || 'None specified'}`
        ].join('\n\n');

        const leftOptions = {
            width: labelWidth - padding * 2,
            lineGap: 3
        };

        const rightOptions = {
            width: detailWidth - padding * 2,
            lineGap: 2
        };

        const leftHeight = doc
            .font('Helvetica-Bold')
            .fontSize(10)
            .heightOfString(leftText, leftOptions);

        const rightHeight = doc
            .font('Helvetica')
            .fontSize(10)
            .heightOfString(rightText, rightOptions);

        const rowHeight =
            Math.max(leftHeight, rightHeight) + padding * 2;

        // Start a new page if needed
        const pageBottom =
            doc.page.height - doc.page.margins.bottom;

        if (doc.y + rowHeight > pageBottom) {
            doc.addPage();
            doc.y = 100;
        }

        const rowY = doc.y;

        // Backgrounds
        doc.rect(tableX, rowY, labelWidth, rowHeight)
            .fill('#E6E6E6');

        doc.rect(
            tableX + labelWidth,
            rowY,
            detailWidth,
            rowHeight
        ).fill('#FFFFFF');

        // Borders
        doc.rect(tableX, rowY, labelWidth, rowHeight)
            .lineWidth(0.8)
            .strokeColor('#104E75')
            .stroke();

        doc.rect(
            tableX + labelWidth,
            rowY,
            detailWidth,
            rowHeight
        )
            .lineWidth(0.8)
            .strokeColor('#104E75')
            .stroke();

        // Left cell
        doc.font('Helvetica-Bold')
            .fontSize(10)
            .fillColor('#222222')
            .text(
                leftText,
                tableX + padding,
                rowY + padding,
                leftOptions
            );

        // Right cell
        doc.font('Helvetica')
            .fontSize(10)
            .fillColor('#222222')
            .text(
                rightText,
                tableX + labelWidth + padding,
                rowY + padding,
                rightOptions
            );

        doc.y = rowY + rowHeight + 8;
    });

    doc.fillColor('#000000');
}



function createPDFDecisionBasis(doc) {

    const sections = [
        {
            heading: 'Decision basis',
            body: 'Advance within the approved budget because collections are supported, the roof scope has a fixed contract and the financing commitment funds the stated sources and uses. The reserves cover the modeled leasing shortfall. Capital must remain on hold until the roof escrow and required insurance are documented. Additional equity or a higher roof requirement cannot be released under this closed decision.'
        },
        {
            heading: 'Accountability',
            body: 'Recorded by Morgan Ellis, Acquisitions Director, on September 17, 2026. Approval authority: Cedar Grove Investment Committee. Committee approval reference: September 17, 2026 acquisition approval minutes.'
        }
    ];

    const leftMargin = 50;
    const contentWidth = 512;

    // =====================================================
    // DECISION BASIS + ACCOUNTABILITY
    // =====================================================

    sections.forEach(function (section) {

        doc
            .font('Helvetica-Bold')
            .fontSize(14)
            .fillColor('#000000')
            .text(section.heading, leftMargin, doc.y, {
                width: contentWidth
            });

        doc.moveDown(0.4);

        doc
            .font('Helvetica')
            .fontSize(12)
            .text(section.body, leftMargin, doc.y, {
                width: contentWidth,
                lineGap: 2
            });

        doc.y += 16;
    });


    // =====================================================
    // RECORDED ACKNOWLEDGEMENTS
    // =====================================================

    doc
        .font('Helvetica-Bold')
        .fontSize(14)
        .text('Recorded acknowledgements', leftMargin, doc.y, {
            width: contentWidth
        });

    doc.moveDown(0.5);

    const acknowledgements = [
        'Confirmed: I confirm this record reflects the decision basis.',

        'Confirmed: I confirm that the approval authority identified above has accepted the stated consequence as part of this decision.',

        'Confirmed: I confirm that this record closes this decision inside Decision Closure. The selected posture, decision basis, stated consequence, and approval authority become final when this record is closed. Any later reconsideration takes place outside this completed test.'
    ];

    acknowledgements.forEach(function (acknowledgement) {

        doc
            .font('Helvetica')
            .fontSize(12)
            .fillColor('#000000')
            .text(acknowledgement, leftMargin, doc.y, {
                width: contentWidth,
                lineGap: 2
            });

        // Clear separation between acknowledgements
        doc.y += 12;
    });


    // =====================================================
    // RECORD ID + CLOSURE TIMESTAMP
    // =====================================================

    doc.y += 4;

    doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .text('Record ID and closure timestamp', leftMargin, doc.y, {
            width: contentWidth
        });

    doc.moveDown(0.3);

    doc
        .font('Helvetica')
        .fontSize(12)
        .text(
            'Record ID: DC-EXAMPLE-001.',
            leftMargin,
            doc.y,
            { width: contentWidth }
        );

    doc.moveDown(0.2);

    doc
        .text(
            'Closed September 17, 2026 at 3:30 PM UTC.',
            leftMargin,
            doc.y,
            { width: contentWidth }
        );

    doc.moveDown(0.2);

    doc
        .text(
            'This is the fixed Stage 1 snapshot. Subsequent verification does not change the two Open statuses shown here.',
            leftMargin,
            doc.y,
            {
                width: contentWidth,
                lineGap: 2
            }
        );


    // =====================================================
    // DISCLAIMER
    // =====================================================

    doc.y += 12;

    doc
        .font('Helvetica')
        .fontSize(9)
        .fillColor('#555555')
        .text(
            'This record documents the decision and authority statements entered by the user. It does not independently authenticate authority, replace required underwriting or professional review, or execute a funds transfer. It does not provide legal, tax, accounting or investment advice.',
            leftMargin,
            doc.y,
            {
                width: contentWidth,
                lineGap: 2
            }
        );


    // =====================================================
    // RESET FORMATTING
    // =====================================================

    doc
        .fillColor('#000000')
        .font('Helvetica')
        .fontSize(12);

}

// Button click
document.getElementById('test-pdf-button').addEventListener('click', function () {
    generatePDF();
});

document.getElementById('dc-form').addEventListener('submit', function (event) {
    event.preventDefault();


    const form = event.target;
    const formData = new FormData(form);



    generatePDF(formData, 'DC-EXAMPLE-001', form);

});