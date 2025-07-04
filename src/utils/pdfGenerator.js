/**
 * PDF Generator utility for creating downloadable fitness and nutrition plans
 */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Generates a PDF for a fitness or nutrition plan and triggers download
 * @param {Object} planData - The plan data containing all necessary information
 */
export const generatePlanPDF = async (planData) => {
  // Input validation
  const requiredProps = [
    "title",
    "description",
    "planType",
    "duration",
    "createdAt",
    "overview",
    "weeklySchedule",
  ];
  if (
    typeof planData !== "object" ||
    planData === null ||
    requiredProps.some((prop) => !(prop in planData))
  ) {
    // TODO: Send error to error tracking service
    throw new Error(
      `Invalid planData: Missing required properties or not an object. Required: ${requiredProps.join(
        ", "
      )}`
    );
  }
  try {
    const doc = createPDFDocument(planData);
    await addCoverPage(doc, planData);
    addContentPages(doc, planData);
    addFootersToAllPages(doc, planData);
    savePDF(doc, planData);
    return true;
  } catch (err) {
    // TODO: Send error to error tracking service
    throw new Error(
      `PDF generation failed: ${err && err.message ? err.message : err}`
    );
  }
};

// Helper: Create and initialize the PDF document
function createPDFDocument(planData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });
  const isNutrition = planData.planType === "nutrition";
  doc.setProperties({
    title: `${planData.title} - ${isNutrition ? "Nutrition" : "Training"} Plan`,
    subject: planData.description,
    creator: "Antique Body",
    author: "Antique Body Platform",
    keywords: isNutrition
      ? "nutrition, diet, meal plan"
      : "training, workout, fitness",
  });
  return doc;
}

// Helper: Add the cover page
async function addCoverPage(doc, planData) {
  const isNutrition = planData.planType === "nutrition";
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const initialYPos = 0;
  let localYPos = initialYPos;
  // Clean white background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  // Orange top border
  doc.setFillColor(255, 107, 0);
  doc.rect(0, 0, pageWidth, 10, "F");
  // Thin orange bottom accent line
  doc.setFillColor(255, 107, 0);
  doc.rect(0, pageHeight - 15, pageWidth, 3, "F");
  // Cover image
  if (planData.image) {
    try {
      const img = await new Promise((resolve, reject) => {
        const image = new window.Image();
        image.crossOrigin = "Anonymous";
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = planData.image;
      });
      doc.addImage(img, "JPEG", 30, 50, pageWidth - 60, 40, undefined, "FAST");
    } catch {
      // TODO: Send error to error tracking service
    }
  }
  // Logo
  doc.setFontSize(28);
  doc.setTextColor(255, 107, 0);
  doc.setFont("helvetica", "bold");
  doc.text("ANTIQUE BODY", pageWidth / 2, 35, { align: "center" });
  // Underline
  doc.setDrawColor(255, 107, 0);
  doc.setLineWidth(0.7);
  doc.line(pageWidth / 2 - 55, 40, pageWidth / 2 + 55, 40);
  // Plan type
  if (isNutrition) {
    doc.setTextColor(34, 197, 94);
  } else {
    doc.setTextColor(30, 64, 158);
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(
    isNutrition ? "NUTRITION PLAN" : "TRAINING PLAN",
    pageWidth / 2,
    55,
    { align: "center" }
  );
  // Title
  doc.setFontSize(32);
  doc.setTextColor(40, 40, 40);
  doc.text(planData.title, pageWidth / 2, 100, { align: "center" });
  // Decorative line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(50, 110, pageWidth - 50, 110);
  // Description
  doc.setTextColor(80, 80, 80);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(11);
  localYPos = addWrappedText(
    doc,
    planData.description,
    30,
    120,
    pageWidth - 60,
    6
  );
  // Timeline
  if (planData.timeline && planData.timeline.length > 0) {
    localYPos += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(255, 107, 0);
    doc.text("Timeline", 30, localYPos);
    localYPos += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    planData.timeline.forEach((block) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${block.week}: ${block.title}`, 35, localYPos);
      localYPos += 5;
      doc.setFont("helvetica", "normal");
      localYPos = addWrappedText(
        doc,
        block.description,
        40,
        localYPos,
        pageWidth - 80,
        5
      );
      localYPos += 2;
    });
  }
  // Features
  if (planData.features && typeof planData.features === "object") {
    localYPos += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(255, 107, 0);
    doc.text("Features", 30, localYPos);
    localYPos += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    const featuresArr = Object.entries(planData.features)
      .filter(([_k, v]) => v)
      .map(([_k, _]) =>
        typeof _k === "string"
          ? _k
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())
          : String(_k)
      );
    for (let i = 0; i < featuresArr.length; i++) {
      doc.circle(33, localYPos + 2, 1.5, "F");
      doc.text(featuresArr[i], 38, localYPos + 3);
      localYPos += 7;
    }
  }
  // Nutrition info
  if (isNutrition && planData.nutritionInfo) {
    localYPos += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(34, 197, 94);
    doc.text("Nutrition Info", 30, localYPos);
    localYPos += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    autoTable(doc, {
      startY: localYPos,
      head: [["Calories", "Protein (g)", "Carbs (g)", "Fat (g)"]],
      body: [
        [
          planData.nutritionInfo.calories || "-",
          planData.nutritionInfo.protein || "-",
          planData.nutritionInfo.carbs || "-",
          planData.nutritionInfo.fats || "-",
        ],
      ],
      theme: "grid",
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
      },
      styles: {
        cellPadding: 4,
        fontSize: 10,
        textColor: [60, 60, 60],
      },
      margin: { left: 30, right: 30 },
    });
    localYPos = doc.lastAutoTable.finalY + 5;
  }
  // Supplements, cooking time, target goal
  if (isNutrition && planData.supplementRecommendations) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(34, 197, 94);
    doc.text("Supplements: ", 30, localYPos);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(planData.supplementRecommendations, 60, localYPos);
    localYPos += 7;
  }
  if (isNutrition && planData.cookingTime) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(34, 197, 94);
    doc.text("Cooking Time: ", 30, localYPos);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(planData.cookingTime, 60, localYPos);
    localYPos += 7;
  }
  if (planData.targetGoal) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(255, 107, 0);
    doc.text("Target Goal: ", 30, localYPos);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(planData.targetGoal, 60, localYPos);
    localYPos += 7;
  }
  // Decorative line
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(50, localYPos + 10, pageWidth - 50, localYPos + 10);
  // Footer area
  const footerY = pageHeight - 40;
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Created:", 30, footerY);
  doc.setFont("helvetica", "normal");
  doc.text(planData.createdAt, 70, footerY);
  doc.setFont("helvetica", "bold");
  doc.text("Duration:", 30, footerY + 10);
  doc.setFont("helvetica", "normal");
  doc.text(planData.duration, 70, footerY + 10);
  doc.setFont("helvetica", "bold");
  doc.text("Generated:", pageWidth - 120, footerY);
  doc.setFont("helvetica", "normal");
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  doc.text(today, pageWidth - 70, footerY);
  if (isNutrition) {
    doc.setTextColor(34, 197, 94);
  } else {
    doc.setTextColor(30, 64, 158);
  }
  doc.setFont("helvetica", "bold");
  doc.text(
    isNutrition ? "Nutrition" : "Training",
    pageWidth - 120,
    footerY + 10
  );
  doc.setFont("helvetica", "normal");
  doc.text("Plan", pageWidth - 70, footerY + 10);
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    "© Antique Body. All rights reserved.",
    pageWidth / 2,
    pageHeight - 7,
    { align: "center" }
  );
  doc.addPage();
}

// Helper: Add wrapped text
function addWrappedText(
  doc,
  text,
  x,
  y,
  maxWidth,
  lineHeight,
  fontSize = 11,
  font = "helvetica",
  style = "normal"
) {
  if (!text) return y;
  doc.setFont(font, style);
  doc.setFontSize(fontSize);
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lineHeight * lines.length;
}

// Helper: Add page header
function addPageHeader(doc, title, pageWidth) {
  doc.setFillColor(17, 17, 17);
  doc.rect(0, 0, pageWidth, 15, "F");
  doc.setTextColor(255, 107, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("ANTIQUE BODY", 15, 10);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(title, pageWidth - 15, 10, { align: "right" });
  doc.setFillColor(255, 107, 0);
  doc.rect(0, 15, pageWidth, 1, "F");
}

// Helper: Add plan overview section
function addPlanOverview(doc, overview, pageWidth, yPos) {
  let localYPos = yPos;
  doc.setTextColor(17, 17, 17);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Plan Summary", 15, localYPos);
  localYPos += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  localYPos =
    addWrappedText(doc, overview.summary, 15, localYPos, pageWidth - 30, 5) +
    10;
  doc.setTextColor(17, 17, 17);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Key Features", 15, localYPos);
  localYPos += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  overview.keyFeatures.forEach((feature, _index) => {
    doc.setFillColor(255, 107, 0);
    doc.circle(20, localYPos, 1.5, "F");
    doc.text(feature, 25, localYPos);
    localYPos += 8;
  });
  localYPos += 5;
  doc.setTextColor(17, 17, 17);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Ideal For", 15, localYPos);
  localYPos += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  return localYPos;
}

// Helper: Add weekly schedule section
function addWeeklySchedule(doc, planData, pageWidth, pageHeight, yPos) {
  let localYPos = yPos;
  const isNutrition = planData.planType === "nutrition";
  const weeklySchedule = planData.weeklySchedule;
  doc.setTextColor(255, 107, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("WEEKLY SCHEDULE", pageWidth / 2, localYPos, { align: "center" });
  doc.setDrawColor(255, 107, 0);
  doc.setLineWidth(0.5);
  doc.line(
    pageWidth / 2 - 50,
    localYPos + 2,
    pageWidth / 2 + 50,
    localYPos + 2
  );
  localYPos += 15;
  if (weeklySchedule && Object.keys(weeklySchedule).length > 0) {
    for (const dayKey of Object.keys(weeklySchedule)) {
      const daySchedule = weeklySchedule[dayKey];
      if (localYPos > pageHeight - 60) {
        doc.addPage();
        addPageHeader(doc, planData.title, pageWidth);
        localYPos = 30;
      }
      const dayTitle = daySchedule.title || dayKey;
      if (isNutrition) {
        doc.setTextColor(34, 197, 94);
      } else {
        doc.setTextColor(30, 64, 158);
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(dayTitle, 15, localYPos);
      doc.setDrawColor(
        isNutrition ? 34 : 30,
        isNutrition ? 197 : 64,
        isNutrition ? 94 : 158
      );
      doc.setLineWidth(0.3);
      const titleWidth = doc.getTextWidth(dayTitle);
      doc.line(15, localYPos + 2, 15 + titleWidth, localYPos + 2);
      localYPos += 10;
      if (isNutrition) {
        if (daySchedule.meals && daySchedule.meals.length > 0) {
          const mealsData = daySchedule.meals.map((meal) => [
            meal.name,
            meal.type.charAt(0).toUpperCase() + meal.type.slice(1),
            `${meal.time}`,
            `${meal.calories} kcal`,
            `P: ${meal.protein}g | C: ${meal.carbs}g | F: ${meal.fat}g`,
          ]);
          autoTable(doc, {
            startY: localYPos,
            head: [["Meal", "Type", "Time", "Calories", "Macros"]],
            body: mealsData,
            theme: "grid",
            headStyles: {
              fillColor: [34, 197, 94],
              textColor: [255, 255, 255],
              fontStyle: "bold",
              halign: "center",
            },
            alternateRowStyles: {
              fillColor: [245, 252, 245],
            },
            styles: {
              cellPadding: 4,
              fontSize: 9,
              lineColor: [200, 200, 200],
              lineWidth: 0.1,
              textColor: [60, 60, 60],
            },
            margin: { left: 15, right: 15 },
            columnStyles: {
              0: { fontStyle: "bold" },
              1: { halign: "center" },
              2: { halign: "center" },
              3: { halign: "center" },
              4: { halign: "center" },
            },
          });
          localYPos = doc.lastAutoTable.finalY + 10;
        } else {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text("No meals scheduled for this day.", 20, localYPos);
          localYPos += 8;
        }
      } else {
        if (daySchedule.exercises && daySchedule.exercises.length > 0) {
          const exercisesData = daySchedule.exercises.map((exercise, idx) => [
            `${idx + 1}. ${exercise.name}`,
            `${exercise.sets} sets`,
            `${exercise.reps} reps`,
            `${exercise.rest}`,
            exercise.notes || "-",
          ]);
          autoTable(doc, {
            startY: localYPos,
            head: [["Exercise", "Sets", "Reps", "Rest", "Notes"]],
            body: exercisesData,
            theme: "grid",
            headStyles: {
              fillColor: [30, 64, 158],
              textColor: [255, 255, 255],
              fontStyle: "bold",
              halign: "center",
            },
            alternateRowStyles: {
              fillColor: [240, 245, 252],
            },
            styles: {
              cellPadding: 4,
              fontSize: 9,
              lineColor: [200, 200, 200],
              lineWidth: 0.1,
              textColor: [60, 60, 60],
            },
            columnStyles: {
              0: { fontStyle: "bold" },
              1: { halign: "center" },
              2: { halign: "center" },
              3: { halign: "center" },
            },
            margin: { left: 15, right: 15 },
          });
          localYPos = doc.lastAutoTable.finalY + 10;
        } else {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text("No exercises scheduled for this day.", 20, localYPos);
          localYPos += 8;
        }
      }
    }
  } else {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("No weekly schedule available for this plan.", 15, localYPos);
  }
  return localYPos;
}

// Helper: Add content pages
function addContentPages(doc, planData) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const overview = planData.overview;
  addPageHeader(doc, planData.title, pageWidth);
  const yPos = 30;
  addPlanOverview(doc, overview, pageWidth, yPos);
  addWeeklySchedule(doc, planData, pageWidth, pageHeight, yPos);
}

// Helper: Add footers to all pages
function addFootersToAllPages(doc, planData) {
  const isNutrition = planData.planType === "nutrition";
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    if (i > 1) {
      doc.setFillColor(245, 245, 245);
      doc.rect(0, pageHeight - 15, pageWidth, 15, "F");
      doc.setFillColor(255, 107, 0);
      doc.rect(0, pageHeight - 15, pageWidth, 1, "F");
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(8);
      doc.text(
        `Page ${i - 1} of ${pageCount - 1}`,
        pageWidth - 20,
        pageHeight - 7,
        { align: "right" }
      );
      if (isNutrition) {
        doc.setTextColor(34, 197, 94);
      } else {
        doc.setTextColor(30, 64, 158);
      }
      doc.text(
        `${isNutrition ? "Nutrition" : "Training"} Plan: ${planData.title}`,
        20,
        pageHeight - 7
      );
    }
  }
}

// Helper: Save PDF
function savePDF(doc, planData) {
  const filename = `${planData.title.replace(/\s+/g, "_")}-${
    planData.planType
  }_plan.pdf`;
  doc.save(filename);
}
