// Generate a unique record identifier using the current timestamp
// and a short random uppercase suffix.
const recordId = `DC-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;

function generatePDF(formData, recordId, form, closeDate) {

    // =====================================================
    // CREATE PDF
    // =====================================================

    const doc = new PDFDocument({
        font: 'Helvetica',
        margins: {
            top: 105,
            bottom: 85,
            left: 50,
            right: 50
        }
    });


    // =====================================================
    // HEADER / FOOTER
    // =====================================================

    let pageNumber = 1;

    // First page
    addHeader(doc);
    // addFooter(doc, pageNumber);

    // Every subsequent page
    doc.on('pageAdded', function () {

        pageNumber++;

        addHeader(doc);
        // addFooter(doc, pageNumber);

    });


    // =====================================================
    // COLLECT PDF DATA
    // =====================================================

    const chunks = [];

    doc.on('data', function (chunk) {
        chunks.push(chunk);
    });


    // =====================================================
    // PDF FINISHED
    // =====================================================

    doc.on('end', function () {

        console.log('PDF generated!');
        console.log('Chunks:', chunks.length);

        const blob = new Blob(chunks, {
            type: 'application/pdf'
        });

        const url = URL.createObjectURL(blob);

        console.log(url);

        const viewBtn = document.getElementById('dk-view-pdf-btn');

        viewBtn.href = url;
        viewBtn.target = '_blank';
        viewBtn.style.display = 'inline-block';

        const downloadBtn = document.getElementById('dk-download-btn');

        downloadBtn.href = url;
        downloadBtn.download = `decision-closure-${recordId}.pdf`;
        downloadBtn.style.display = 'inline-block';

        const successSection = document.getElementById('success-section');

        if (successSection) {
            showSection(successSection);
        }

    });


    // =====================================================
    // CREATE PDF SECTIONS
    // =====================================================

    createPDFDecisionClosure(doc, formData, closeDate, recordId);
    createPDFAcceptedConsequence(doc, formData);
    createPDFConditionsTable(doc, formData, form);
    createPDFDecisionBasis(doc, formData, closeDate, recordId);
    createPDFDisclaimerPage(doc);

    doc.end();

}


function createPDFDecisionClosure(doc, formData = {}, closeDate) {

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

    const proposedAction = formData.get('proposedAction') || 'Not selected';

    const actionLabels = {
        advance: 'ADVANCE',
        modify: 'MODIFY',
        defer: 'DEFER',
        decline: 'DECLINE'
    };


    // =====================================================
    // FORMAT HELPERS
    // =====================================================

    function formatDate(value) {

        if (!value || value === 'Not provided') {
            return 'Not provided';
        }

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
    // PAGE / TYPOGRAPHY SETTINGS
    // =====================================================

    const tableX = 50;
    const tableWidth = 512;

    const detailWidth = 200;
    const valueWidth = tableWidth - detailWidth;

    const headerHeight = 32;

    const headerFontSize = 14;
    const bodyFontSize = 12;

    const rowLineHeight = 12;
    const minimumRowHeight = rowLineHeight * 2;

    const cellPadding = 10;
    const rowPadding = 6;


    // =====================================================
    // TITLE
    // =====================================================

    // Reserve space for the title and decision status.
    ensurePDFSpace(doc, 115);

    doc
        .font('Helvetica-Bold')
        .fontSize(20)
        .fillColor('#222222')
        .text('Decision Closure Record', 50, doc.y, {
            width: tableWidth
        });

    doc.moveDown(0.4);

    doc
        .font('Helvetica-Oblique')
        .fontSize(9)
        .fillColor('#666666')
        .text('Stage 1', 50, doc.y, {
            width: tableWidth
        });

    doc.moveDown(1.5);


    // =====================================================
    // DECISION STATUS
    // =====================================================

    const actionLabel =
        actionLabels[proposedAction] || proposedAction.toUpperCase();

    doc
        .font('Helvetica-Bold')
        .fontSize(14)
        .fillColor('#222222')
        .text(`CLOSED DECISION: ${actionLabel}`, 50, doc.y, {
            width: tableWidth
        });

    doc.moveDown(1);


    // =====================================================
    // TABLE DATA
    // =====================================================

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
            `${recordId} | Closed ${closeDate}`
        ]
    ];


    // =====================================================
    // CALCULATE ROW HEIGHTS
    // =====================================================

    doc
        .font('Helvetica')
        .fontSize(bodyFontSize);

    const rowHeights = rows.map(row => {

        const labelHeight = doc.heightOfString(row[0] || '', {
            width: detailWidth - (cellPadding * 2),
            lineGap: 0
        });

        const valueHeight = doc.heightOfString(row[1] || '', {
            width: valueWidth - (cellPadding * 2),
            lineGap: 0
        });

        return Math.max(
            minimumRowHeight,
            labelHeight,
            valueHeight
        ) + (rowPadding * 2);

    });


    // =====================================================
    // TABLE HEADER FUNCTION
    // =====================================================

    function drawTableHeader() {

        ensurePDFSpace(doc, headerHeight + rowHeights[0]);

        const headerY = doc.y;

        // Cell backgrounds
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

        // Cell borders
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

        // Header text
        doc
            .fillColor('#000000')
            .font('Helvetica-Bold')
            .fontSize(headerFontSize)
            .text(
                'Decision Details',
                tableX + cellPadding,
                headerY + 10,
                {
                    width: detailWidth - (cellPadding * 2)
                }
            )
            .text(
                'Recorded value',
                tableX + detailWidth + cellPadding,
                headerY + 10,
                {
                    width: valueWidth - (cellPadding * 2)
                }
            );

        doc.y = headerY + headerHeight;

        doc
            .font('Helvetica')
            .fontSize(bodyFontSize)
            .fillColor('#000000');

    }


    // =====================================================
    // DRAW TABLE HEADER
    // =====================================================

    drawTableHeader();


    // =====================================================
    // TABLE ROWS
    // =====================================================

    rows.forEach((row, index) => {

        const rowHeight = rowHeights[index];

        // Check whether the row fits.
        // If not, start a new page and repeat the table header.

        const bottomLimit =
            doc.page.height - doc.page.margins.bottom;

        if (doc.y + rowHeight > bottomLimit) {

            doc.addPage();

            drawTableHeader();

        }

        const currentY = doc.y;

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

        // Left cell text
        doc
            .fillColor('#000000')
            .font('Helvetica')
            .fontSize(bodyFontSize)
            .text(
                row[0],
                x1 + cellPadding,
                currentY + rowPadding,
                {
                    width: detailWidth - (cellPadding * 2),
                    lineGap: 0
                }
            );

        // Right cell text
        doc
            .font('Helvetica')
            .fontSize(bodyFontSize)
            .text(
                row[1],
                x2 + cellPadding,
                currentY + rowPadding,
                {
                    width: valueWidth - (cellPadding * 2),
                    lineGap: 0
                }
            );

        doc.y = currentY + rowHeight;

    });


    // =====================================================
    // CLEANUP
    // =====================================================

    doc.y += 12;
    doc.x = 50;

    doc
        .fillColor('#000000')
        .strokeColor('#000000')
        .font('Helvetica')
        .fontSize(12);

}




function addHeader(doc) {

    doc.save();

    const pageWidth = doc.page.width;
    const contentWidth = pageWidth - 100;

    // Header title
    doc
        .fillColor('#000000')
        .font('Helvetica-Bold')
        .fontSize(18)
        .text('Decision Closure', 50, 30, {
            width: contentWidth,
            align: 'center',
            lineBreak: false
        });

    // Header subtitle
    doc
        .font('Helvetica-Oblique')
        .fontSize(9)
        .fillColor('#555555')
        .text('an analysis tool from John', 50, 60, {
            width: contentWidth,
            align: 'center',
            lineBreak: false
        });

    // Full-width header divider
    doc
        .moveTo(50, 85)
        .lineTo(pageWidth - 50, 85)
        .lineWidth(1)
        .strokeColor('#1470af')
        .stroke();

    doc.restore();

    // Reset content position and typography
    doc.y = 105;
    doc.x = 50;

    doc
        .font('Helvetica')
        .fontSize(12)
        .fillColor('#000000');

}



function addFooter(doc, pageNumber = 1) {

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    // Preserve the current content position
    const currentY = doc.y;

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
            'Decision Closure | Professional Decision-Support Tool',
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
            pageWidth - 162,
            pageHeight - 43,
            {
                width: 112,
                align: 'right',
                lineBreak: false
            }
        );

    doc.restore();

    // Restore content position
    doc.y = currentY;
    doc.x = 50;

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
    // INITIAL SPACING
    // =====================================================

    doc.x = leftMargin;
    doc.y += 8;


    // =====================================================
    // CREATE SECTIONS
    // =====================================================

    sections.forEach(section => {

        writePDFSection(doc, section.heading, section.body, {
            x: leftMargin,
            width: contentWidth,
            headingFontSize,
            bodyFontSize,
            spacing: sectionSpacing,
            lineGap: 2,
            minimumBodySpace: 30
        });

    });


    // =====================================================
    // RESET FORMATTING
    // =====================================================

    doc
        .font('Helvetica')
        .fontSize(12)
        .fillColor('#000000');

    doc.x = leftMargin;

}


// =====================================================
// PAGE SPACE MANAGEMENT
// =====================================================

function ensurePDFSpace(doc, requiredHeight = 50) {

    const bottomLimit =
        doc.page.height - doc.page.margins.bottom;

    if (doc.y + requiredHeight > bottomLimit) {

        doc.addPage();

        // Header/footer are automatically added
        // through the pageAdded event.

    }

}


// =====================================================
// PDF TEXT SECTION
// =====================================================

function writePDFSection(doc, heading, body, options = {}) {

    const leftMargin = 50;
    const contentWidth = 512;

    const headingFontSize = options.headingFontSize || 14;
    const bodyFontSize = options.bodyFontSize || 12;
    const spacing = options.spacing ?? 16;

    // Measure heading
    doc.font('Helvetica-Bold')
        .fontSize(headingFontSize);

    const headingHeight = doc.heightOfString(heading, {
        width: contentWidth
    });

    // Measure body
    doc.font('Helvetica')
        .fontSize(bodyFontSize);

    const bodyHeight = doc.heightOfString(body, {
        width: contentWidth,
        lineGap: 2
    });

    const availableHeight =
        doc.page.height -
        doc.page.margins.top -
        doc.page.margins.bottom;

    const totalHeight =
        headingHeight + 8 + bodyHeight + spacing;

    // If the entire section fits on a page,
    // keep it together whenever possible.
    // Otherwise reserve room for the heading and
    // the beginning of the body.
    ensurePDFSpace(
        doc,
        Math.min(totalHeight, Math.min(100, availableHeight))
    );

    // Heading
    doc.font('Helvetica-Bold')
        .fontSize(headingFontSize)
        .fillColor('#000000')
        .text(heading, leftMargin, doc.y, {
            width: contentWidth
        });

    doc.moveDown(0.4);

    // Body
    doc.font('Helvetica')
        .fontSize(bodyFontSize)
        .fillColor('#000000')
        .text(body, leftMargin, doc.y, {
            width: contentWidth,
            lineGap: 2
        });

    doc.y += spacing;

}



function createPDFConditionsTable(doc, formData, form) {

    // =====================================================
    // FORM DATA
    // =====================================================

    const conditionCards = Array.from(
        form.querySelectorAll('[data-condition-card]')
    );

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


    // =====================================================
    // LAYOUT SETTINGS
    // =====================================================

    const tableX = 50;
    const tableWidth = 512;

    const labelWidth = 155;
    const detailWidth = tableWidth - labelWidth;

    const padding = 9;
    const cardSpacing = 8;

    const fontSize = 10;


    // =====================================================
    // FIELD HELPERS
    // =====================================================

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


    // =====================================================
    // CONDITION DATA
    // =====================================================

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


    // =====================================================
    // SUMMARY DATA
    // =====================================================

    const countStatus = (status) =>
        conditions.filter(
            condition => condition.status === status
        ).length;

    const acceptedExceptions = conditions.filter(
        condition => condition.timing === 'accepted-exception'
    ).length;

    const summaryText = [
        `Total conditions: ${conditions.length}`,
        `Open: ${countStatus('open')}`,
        `Satisfied: ${countStatus('satisfied')}`,
        `Waived: ${countStatus('waived')}`,
        `Failed: ${countStatus('failed')}`,
        `Changed: ${countStatus('changed')}`,
        `Accepted exceptions: ${acceptedExceptions}`
    ].join('\n');


    // =====================================================
    // SECTION HEADING
    // =====================================================

    ensurePDFSpace(doc, 85);

    doc.moveDown(1);

    doc
        .font('Helvetica-Bold')
        .fontSize(16)
        .fillColor('#222222')
        .text('Conditions Register', tableX, doc.y, {
            width: tableWidth
        });

    doc.moveDown(0.5);

    doc
        .font('Helvetica')
        .fontSize(10)
        .fillColor('#555555')
        .text(
            'Closed requirements and their assigned responsibility, evidence, and status.',
            tableX,
            doc.y,
            {
                width: tableWidth
            }
        );

    doc.moveDown(1);


    // =====================================================
    // CONDITION SUMMARY
    // =====================================================

    writePDFSection(
        doc,
        'Condition Summary',
        summaryText,
        {
            x: tableX,
            width: tableWidth,
            headingFontSize: 11,
            bodyFontSize: 10,
            spacing: 12,
            lineGap: 3,
            minimumBodySpace: 75,
            headingSpacing: 0.35
        }
    );


    // =====================================================
    // NO CONDITIONS
    // =====================================================

    if (conditions.length === 0) {

        ensurePDFSpace(doc, 30);

        doc
            .font('Helvetica-Oblique')
            .fontSize(10)
            .fillColor('#555555')
            .text(
                'No conditions were recorded.',
                tableX,
                doc.y,
                {
                    width: tableWidth
                }
            );

        doc.y += 12;

        doc
            .font('Helvetica')
            .fontSize(12)
            .fillColor('#000000');

        doc.x = tableX;

        return;
    }


    // =====================================================
    // DRAW CONDITION CARDS
    // =====================================================

    conditions.forEach(condition => {

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


        // =================================================
        // TEXT MEASUREMENT
        // =================================================

        const leftOptions = {
            width: labelWidth - (padding * 2),
            lineGap: 3
        };

        const rightOptions = {
            width: detailWidth - (padding * 2),
            lineGap: 2
        };

        doc
            .font('Helvetica-Bold')
            .fontSize(fontSize);

        const leftHeight = doc.heightOfString(
            leftText,
            leftOptions
        );

        doc
            .font('Helvetica')
            .fontSize(fontSize);

        const rightHeight = doc.heightOfString(
            rightText,
            rightOptions
        );

        const rowHeight =
            Math.max(leftHeight, rightHeight) + (padding * 2);


        // =================================================
        // PAGE BREAK
        // =================================================

        // Keep each condition card together.
        // ensurePDFSpace uses the page header's starting position
        // when a new page is needed.

        ensurePDFSpace(doc, rowHeight + cardSpacing);


        // =================================================
        // CARD POSITION
        // =================================================

        const rowY = doc.y;

        const leftX = tableX;
        const rightX = tableX + labelWidth;


        // =================================================
        // CELL BACKGROUNDS
        // =================================================

        doc
            .fillColor('#E6E6E6')
            .rect(
                leftX,
                rowY,
                labelWidth,
                rowHeight
            )
            .fill();

        doc
            .fillColor('#FFFFFF')
            .rect(
                rightX,
                rowY,
                detailWidth,
                rowHeight
            )
            .fill();


        // =================================================
        // CELL BORDERS
        // =================================================

        doc
            .lineWidth(0.8)
            .strokeColor('#104E75')
            .rect(
                leftX,
                rowY,
                labelWidth,
                rowHeight
            )
            .stroke();

        doc
            .rect(
                rightX,
                rowY,
                detailWidth,
                rowHeight
            )
            .stroke();


        // =================================================
        // LEFT CELL
        // =================================================

        doc
            .font('Helvetica-Bold')
            .fontSize(fontSize)
            .fillColor('#222222')
            .text(
                leftText,
                leftX + padding,
                rowY + padding,
                leftOptions
            );


        // =================================================
        // RIGHT CELL
        // =================================================

        doc
            .font('Helvetica')
            .fontSize(fontSize)
            .fillColor('#222222')
            .text(
                rightText,
                rightX + padding,
                rowY + padding,
                rightOptions
            );


        // =================================================
        // ADVANCE DOCUMENT POSITION
        // =================================================

        doc.y = rowY + rowHeight + cardSpacing;
        doc.x = tableX;

    });


    // =====================================================
    // RESET FORMATTING
    // =====================================================

    doc
        .font('Helvetica')
        .fontSize(12)
        .fillColor('#000000')
        .strokeColor('#000000');

    doc.x = tableX;

}





function createPDFDecisionBasis(doc, formData, closeDate) {

    // =====================================================
    // FORM DATA
    // =====================================================

    const decisionOwner =
        formData.get('decisionOwner') || 'Not provided';

    const approvalAuthority =
        formData.get('approvalAuthority') || 'Not provided';

    const decisionBasis =
        formData.get('decisionBasis') || 'Not provided';


    // =====================================================
    // SECTION DATA
    // =====================================================

    const sections = [
        {
            heading: 'Decision basis',
            body: decisionBasis
        },
        {
            heading: 'Accountability',
            body: `Recorded by ${decisionOwner}, on ${closeDate}. Approval authority: ${approvalAuthority}.`
        }
    ];


    // =====================================================
    // DECISION BASIS + ACCOUNTABILITY
    // =====================================================

    sections.forEach(section => {

        writePDFSection(doc, section.heading, section.body, {
            x: 50,
            width: 512,
            headingFontSize: 14,
            bodyFontSize: 12,
            spacing: 16,
            lineGap: 2,
            minimumBodySpace: 30
        });

    });


    // =====================================================
    // RECORDED ACKNOWLEDGEMENTS
    // =====================================================

    ensurePDFSpace(doc, 55);

    doc
        .font('Helvetica-Bold')
        .fontSize(14)
        .fillColor('#000000')
        .text('Recorded acknowledgements', 50, doc.y, {
            width: 512
        });

    doc.moveDown(0.5);


    const acknowledgements = [
        'Confirmed: I confirm this record reflects the decision basis.',

        'Confirmed: I confirm that the approval authority identified above has accepted the stated consequence as part of this decision.',

        'Confirmed: I confirm that this record closes this decision inside Decision Closure. The selected posture, decision basis, stated consequence, and approval authority become final when this record is closed. Any later reconsideration takes place outside this completed test.'
    ];


    acknowledgements.forEach(acknowledgement => {

        // Measure the acknowledgement so we can avoid
        // starting it at the very bottom of a page.

        doc
            .font('Helvetica')
            .fontSize(12);

        const acknowledgementHeight = doc.heightOfString(
            acknowledgement,
            {
                width: 512,
                lineGap: 2
            }
        );

        ensurePDFSpace(
            doc,
            Math.min(acknowledgementHeight + 12, 80)
        );

        doc
            .font('Helvetica')
            .fontSize(12)
            .fillColor('#000000')
            .text(acknowledgement, 50, doc.y, {
                width: 512,
                lineGap: 2
            });

        // Separation between acknowledgements.
        doc.y += 12;

    });


    // =====================================================
    // RECORD ID + CLOSURE TIMESTAMP
    // =====================================================

    writePDFSection(
        doc,
        'Record ID and closure timestamp',
        [
            `Record ID: ${recordId}.`,
            `Closed ${closeDate}`,
            'This is the fixed Stage 1 snapshot. Subsequent verification does not change the two Open statuses shown here.'
        ].join('\n\n'),
        {
            x: 50,
            width: 512,
            headingFontSize: 12,
            bodyFontSize: 12,
            spacing: 12,
            lineGap: 2,
            minimumBodySpace: 35,
            headingSpacing: 0.3
        }
    );


    // =====================================================
    // DISCLAIMER
    // =====================================================

    const disclaimer =
        'This record documents the decision and authority statements entered by the user. It does not independently authenticate authority, replace required underwriting or professional review, or execute a funds transfer. It does not provide legal, tax, accounting or investment advice.';

    doc
        .font('Helvetica')
        .fontSize(9);

    const disclaimerHeight = doc.heightOfString(disclaimer, {
        width: 512,
        lineGap: 2
    });

    ensurePDFSpace(
        doc,
        Math.min(disclaimerHeight + 12, 60)
    );

    doc
        .font('Helvetica')
        .fontSize(9)
        .fillColor('#555555')
        .text(disclaimer, 50, doc.y, {
            width: 512,
            lineGap: 2
        });

    doc.y += 12;


    // =====================================================
    // RESET FORMATTING
    // =====================================================

    doc
        .font('Helvetica')
        .fontSize(12)
        .fillColor('#000000')
        .strokeColor('#000000');

    doc.x = 50;

}




function createPDFDisclaimerPage(doc) {

    // =====================================================
    // NEW PAGE
    // =====================================================

    doc.addPage();

    // The pageAdded event handles the standard header/footer.
    // Content begins at the position established by addHeader().


    // =====================================================
    // TITLE
    // =====================================================

    ensurePDFSpace(doc, 85);

    doc
        .font('Helvetica-Bold')
        .fontSize(18)
        .fillColor('#222222')
        .text('Important Notice', 50, doc.y, {
            width: 512
        });

    doc.moveDown(0.3);

    doc
        .font('Helvetica')
        .fontSize(11)
        .fillColor('#666666')
        .text('Decision Record and Reliance', 50, doc.y, {
            width: 512
        });

    doc.moveDown(0.7);


    // =====================================================
    // DIVIDER
    // =====================================================

    const dividerY = doc.y;

    doc
        .moveTo(50, dividerY)
        .lineTo(doc.page.width - 50, dividerY)
        .lineWidth(1)
        .strokeColor('#CCCCCC')
        .stroke();

    doc.y = dividerY + 25;


    // =====================================================
    // DISCLAIMER BODY
    // =====================================================

    const paragraphs = [

        'Decision Closure is a decision-documentation and accountability tool provided by Real Estate Tradecraft. This report records the information, judgments, assumptions, accepted consequences, conditions, and approval representations entered by the user. It does not independently verify the accuracy or completeness of that information, authenticate approval authority, or establish that any stated condition has been satisfied.',

        'A recorded decision to ADVANCE, STOP, or otherwise close a decision reflects the user\'s documented decision posture. It does not independently authorize financing, capital expenditure, funds transfer, waiver of conditions, or transaction execution. Open conditions remain subject to their stated requirements, responsible parties, and applicable approval processes.',

        'The user and the appropriate decision-making authorities remain responsible for due diligence, underwriting, verification, professional review, compliance, and implementation.',

        'This report does not constitute legal, tax, accounting, investment, or lending advice. Real Estate Tradecraft makes no representation or guarantee regarding transaction approval, funding, financial performance, or investment outcomes.'

    ];


    // =====================================================
    // RENDER PARAGRAPHS
    // =====================================================

    paragraphs.forEach(paragraph => {

        // Measure paragraph before rendering.

        doc
            .font('Helvetica')
            .fontSize(10);

        const paragraphHeight = doc.heightOfString(paragraph, {
            width: 512,
            lineGap: 4
        });


        // Reserve enough room to begin the paragraph.
        // Long paragraphs can continue naturally across pages.

        ensurePDFSpace(
            doc,
            Math.min(paragraphHeight + 18, 100)
        );


        // Render paragraph.

        doc
            .font('Helvetica')
            .fontSize(10)
            .fillColor('#333333')
            .text(paragraph, 50, doc.y, {
                width: 512,
                lineGap: 4,
                align: 'left'
            });


        // Separation between paragraphs.

        doc.y += 18;
        doc.x = 50;

    });


    // =====================================================
    // RESET FORMATTING
    // =====================================================

    doc
        .font('Helvetica')
        .fontSize(12)
        .fillColor('#000000')
        .strokeColor('#000000');

    doc.x = 50;

}

 



document.getElementById('dc-form').addEventListener('submit', function (event) {
    event.preventDefault();

    console.log('SUBMIT'); 

    // Submission timestamp
    const closedAt = new Date();

    document.getElementById('dc-closed-record-timestamp').textContent =
        closedAt.toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            timeZoneName: 'short'
    });
    
    const form = event.target;
    const formData = new FormData(form);



    generatePDF(formData, recordId, form, closedAt);

});