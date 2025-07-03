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
  try {
    // Set up document with slightly increased page size for better margins
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const {
      title,
      description,
      planType,
      duration,
      createdAt,
      overview,
      weeklySchedule,
    } = planData;

    const isNutrition = planType === "nutrition";
    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    // Page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Initialize yPos variable for positioning elements
    let yPos = 0;

    // Set document properties
    doc.setProperties({
      title: `${title} - ${isNutrition ? "Nutrition" : "Training"} Plan`,
      subject: description,
      creator: "Antique Body",
      author: "Antique Body Platform",
      keywords: isNutrition
        ? "nutrition, diet, meal plan"
        : "training, workout, fitness",
    });

    // Helper function for text wrapping
    const addWrappedText = (
      text,
      x,
      y,
      maxWidth,
      lineHeight,
      fontSize = 11,
      font = "helvetica",
      style = "normal"
    ) => {
      if (!text) return y;
      doc.setFont(font, style);
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return y + lineHeight * lines.length;
    };

    // ===== COVER PAGE =====
    // Clean white background instead of dark header
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Add orange top border
    doc.setFillColor(255, 107, 0);
    doc.rect(0, 0, pageWidth, 10, "F");

    // Add thin orange bottom accent line
    doc.setFillColor(255, 107, 0);
    doc.rect(0, pageHeight - 15, pageWidth, 3, "F");

    // Add Antique Body logo
    doc.setFontSize(28);
    doc.setTextColor(255, 107, 0);
    doc.setFont("helvetica", "bold");
    doc.text("ANTIQUE BODY", pageWidth / 2, 35, { align: "center" });

    // Add simple underline
    doc.setDrawColor(255, 107, 0);
    doc.setLineWidth(0.7);
    doc.line(pageWidth / 2 - 55, 40, pageWidth / 2 + 55, 40);

    // Add plan type text - no background
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

    // Add title with bigger font size and centered
    doc.setFontSize(32);
    doc.setTextColor(40, 40, 40);
    doc.text(title, pageWidth / 2, 80, { align: "center" });

    // Add a decorative line below title
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(50, 90, pageWidth - 50, 90);

    // Description with no background
    doc.setTextColor(80, 80, 80);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(11);
    yPos = addWrappedText(description, 30, 110, pageWidth - 60, 6);

    // Add decorative line below description
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(50, yPos + 10, pageWidth - 50, yPos + 10);

    // Add metadata in the footer area
    const footerY = pageHeight - 40;

    // Add dates with clean layout
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(10);

    // Add elegantly positioned metadata
    doc.setFont("helvetica", "bold");
    doc.text("Created:", 30, footerY);
    doc.setFont("helvetica", "normal");
    doc.text(createdAt, 70, footerY);

    doc.setFont("helvetica", "bold");
    doc.text("Duration:", 30, footerY + 10);
    doc.setFont("helvetica", "normal");
    doc.text(duration, 70, footerY + 10);

    doc.setFont("helvetica", "bold");
    doc.text("Generated:", pageWidth - 120, footerY);
    doc.setFont("helvetica", "normal");
    doc.text(today, pageWidth - 70, footerY);

    // Add plan type in color next to generation date
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

    // Add copyright notice
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      "© Antique Body. All rights reserved.",
      pageWidth / 2,
      pageHeight - 7,
      { align: "center" }
    );

    // Add new page for content
    doc.addPage();

    // ===== CONTENT PAGES =====
    // Add header to every content page
    const addPageHeader = () => {
      // Add minimal header
      doc.setFillColor(17, 17, 17);
      doc.rect(0, 0, pageWidth, 15, "F");

      doc.setTextColor(255, 107, 0);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("ANTIQUE BODY", 15, 10);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text(title, pageWidth - 15, 10, { align: "right" });

      // Add thin orange line
      doc.setFillColor(255, 107, 0);
      doc.rect(0, 15, pageWidth, 1, "F");
    };

    addPageHeader();

    // Start position for content
    yPos = 30;

    // Plan Overview Section - removed background color
    doc.setTextColor(255, 107, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("PLAN OVERVIEW", pageWidth / 2, yPos, { align: "center" });

    // Add thin underline
    doc.setDrawColor(255, 107, 0);
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 - 40, yPos + 2, pageWidth / 2 + 40, yPos + 2);

    yPos += 15;

    // Plan Summary
    doc.setTextColor(17, 17, 17);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Plan Summary", 15, yPos);
    yPos += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    yPos = addWrappedText(overview.summary, 15, yPos, pageWidth - 30, 5) + 10;

    // Key Features - removed background color
    doc.setTextColor(17, 17, 17);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Key Features", 15, yPos);
    yPos += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);

    overview.keyFeatures.forEach((feature, _index) => {
      // Simple bullet points
      doc.setFillColor(255, 107, 0);
      doc.circle(20, yPos, 1.5, "F");
      doc.text(feature, 25, yPos);
      yPos += 8;
    });

    yPos += 5;

    // Target Audience section - removed background color
    doc.setTextColor(17, 17, 17);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Ideal For", 15, yPos);
    yPos += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);

    // Add weekly schedule section
    // Check if we need to add a new page
    if (yPos > pageHeight - 60) {
      doc.addPage();
      addPageHeader();
      yPos = 30;
    }

    // Weekly Schedule header - removed background color
    doc.setTextColor(255, 107, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("WEEKLY SCHEDULE", pageWidth / 2, yPos, { align: "center" });

    // Add thin underline
    doc.setDrawColor(255, 107, 0);
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 - 50, yPos + 2, pageWidth / 2 + 50, yPos + 2);

    yPos += 15;

    // For each day in the weekly schedule
    if (weeklySchedule) {
      const days = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];

      for (const day of days) {
        if (weeklySchedule[day]) {
          // Add a new page if we're running out of space
          if (yPos > pageHeight - 60) {
            doc.addPage();
            addPageHeader();
            yPos = 30;
          }

          const daySchedule = weeklySchedule[day];
          const dayTitle =
            daySchedule.title ||
            `${day.charAt(0).toUpperCase() + day.slice(1)}`;

          // Day header - removed background color, just color text
          if (isNutrition) {
            doc.setTextColor(34, 197, 94);
          } else {
            doc.setTextColor(30, 64, 158);
          }
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.text(dayTitle, 15, yPos);

          // Add thin underline in plan color
          doc.setDrawColor(
            isNutrition ? 34 : 30,
            isNutrition ? 197 : 64,
            isNutrition ? 94 : 158
          );
          doc.setLineWidth(0.3);
          const titleWidth = doc.getTextWidth(dayTitle);
          doc.line(15, yPos + 2, 15 + titleWidth, yPos + 2);

          yPos += 10;

          if (isNutrition) {
            // Render nutrition meals using a clean table
            if (daySchedule.meals && daySchedule.meals.length > 0) {
              const mealsData = daySchedule.meals.map((meal) => [
                meal.name,
                meal.type.charAt(0).toUpperCase() + meal.type.slice(1),
                `${meal.time}`,
                `${meal.calories} kcal`,
                `P: ${meal.protein}g | C: ${meal.carbs}g | F: ${meal.fat}g`,
              ]);

              autoTable(doc, {
                startY: yPos,
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

              yPos = doc.lastAutoTable.finalY + 10;
            } else {
              doc.setFont("helvetica", "italic");
              doc.setFontSize(10);
              doc.setTextColor(100, 100, 100);
              doc.text("No meals scheduled for this day.", 20, yPos);
              yPos += 8;
            }
          } else {
            // Render training exercises using a clean table
            if (daySchedule.exercises && daySchedule.exercises.length > 0) {
              const exercisesData = daySchedule.exercises.map(
                (exercise, idx) => [
                  `${idx + 1}. ${exercise.name}`,
                  `${exercise.sets} sets`,
                  `${exercise.reps} reps`,
                  `${exercise.rest}`,
                  exercise.notes || "-",
                ]
              );

              autoTable(doc, {
                startY: yPos,
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

              yPos = doc.lastAutoTable.finalY + 10;
            } else {
              doc.setFont("helvetica", "italic");
              doc.setFontSize(10);
              doc.setTextColor(100, 100, 100);
              doc.text("No exercises scheduled for this day.", 20, yPos);
              yPos += 8;
            }
          }
        }
      }
    } else {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("No weekly schedule available for this plan.", 15, yPos);
    }

    // Add footer to all pages
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      // Skip page number on cover
      if (i > 1) {
        // Add simple page footer
        doc.setFillColor(245, 245, 245);
        doc.rect(0, pageHeight - 15, pageWidth, 15, "F");

        // Add thin orange line
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

        // Add plan type indicator - fixed color setting
        if (isNutrition) {
          doc.setTextColor(34, 197, 94);
        } else {
          doc.setTextColor(30, 64, 158);
        }
        doc.text(
          `${isNutrition ? "Nutrition" : "Training"} Plan: ${title}`,
          20,
          pageHeight - 7
        );
      }
    }

    // Save PDF with filename based on plan title
    const filename = `${title.replace(/\s+/g, "_")}-${planType}_plan.pdf`;
    doc.save(filename);

    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};
