"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";

import { Card, Button, Modal, Accordion, Text } from "@/components/common";

export default function ComponentsDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  // Sample data for cards
  const cardData = [
    {
      id: 1,
      title: "Premium Fitness Plan",
      description: "Advanced workouts for experienced athletes",
      icon: "mdi:dumbbell",
      variant: "premium",
    },
    {
      id: 2,
      title: "Nutrition Guidance",
      description: "Personalized meal plans and nutrition advice",
      icon: "mdi:food-apple",
      variant: "dark",
    },
    {
      id: 3,
      title: "Recovery Sessions",
      description: "Specialized recovery techniques and stretching",
      icon: "mdi:yoga",
      variant: "glass",
    },
  ];

  // Accordion data
  const accordionData = [
    {
      title: "Workout Programs",
      icon: "mdi:dumbbell",
      iconColor: "#FF7800",
      content:
        "Our workout programs are designed by professional trainers with years of experience. Each program is tailored to different fitness levels and goals.",
    },
    {
      title: "Nutrition Plans",
      icon: "mdi:food-apple",
      iconColor: "#4ADE80",
      content:
        "Our nutrition plans are created by certified nutritionists to complement your fitness journey. We focus on sustainable eating habits rather than restrictive diets.",
    },
    {
      title: "Community Support",
      icon: "mdi:account-group",
      iconColor: "#3B82F6",
      content:
        "Join our community of like-minded individuals on the same fitness journey. Share experiences, get motivation, and celebrate achievements together.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6 md:p-10">
      {/* Header */}
      <div className="mb-10 text-center">
        <Text variant="h1" gradient className="mb-2">
          Components Demo
        </Text>
        <Text variant="bodyLarge" color="subtle" className="max-w-2xl mx-auto">
          A showcase of clean and modern UI components following Antique Body's
          design system
        </Text>
      </div>

      {/* Text Component Showcase */}
      <Card
        variant="dark"
        className="mb-10"
        width="100%"
        maxWidth="1200px"
        padding="30px"
        mx="auto"
      >
        <Text variant="h3" gradient className="mb-6">
          Text Component
        </Text>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Text variant="h4" className="mb-4">
              Headings
            </Text>
            <div className="space-y-3">
              <Text variant="h1">Heading 1</Text>
              <Text variant="h2">Heading 2</Text>
              <Text variant="h3">Heading 3</Text>
              <Text variant="h4">Heading 4</Text>
              <Text variant="h5">Heading 5</Text>
              <Text variant="h6">Heading 6</Text>
            </div>
          </div>

          <div>
            <Text variant="h4" className="mb-4">
              Text Styles
            </Text>
            <div className="space-y-3">
              <Text variant="body">Default body text</Text>
              <Text variant="bodyLarge">Large body text</Text>
              <Text variant="bodySmall">Small body text</Text>
              <Text variant="caption">Caption text</Text>
              <Text variant="label">Label text</Text>
              <Text variant="body" weight="bold">
                Bold text
              </Text>
              <Text variant="body" gradient>
                Gradient text
              </Text>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Text variant="h4" className="mb-4">
            Text Colors
          </Text>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Text color="default">Default</Text>
            <Text color="muted">Muted</Text>
            <Text color="subtle">Subtle</Text>
            <Text color="primary">Primary</Text>
            <Text color="secondary">Secondary</Text>
            <Text color="success">Success</Text>
            <Text color="warning">Warning</Text>
            <Text color="error">Error</Text>
          </div>
        </div>
      </Card>

      {/* Button Component Showcase */}
      <Card
        variant="dark"
        className="mb-10"
        width="100%"
        maxWidth="1200px"
        padding="30px"
        mx="auto"
      >
        <Text variant="h3" gradient className="mb-6">
          Button Component
        </Text>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Text variant="h4" className="mb-4">
              Button Variants
            </Text>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="orangeFilled">Orange Filled</Button>
              <Button variant="outlineOrange">Orange Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="ghostOrange">Ghost Orange</Button>
            </div>
          </div>

          <div>
            <Text variant="h4" className="mb-4">
              Button Sizes
            </Text>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" size="small">
                Small
              </Button>
              <Button variant="primary" size="default">
                Default
              </Button>
              <Button variant="primary" size="large">
                Large
              </Button>
              <Button variant="primary" size="compact">
                Compact
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Text variant="h4" className="mb-4">
            Button States
          </Text>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" loading>
              Loading
            </Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
            <Button variant="primary" leftIcon={<Icon icon="mdi:check" />}>
              With Left Icon
            </Button>
            <Button
              variant="primary"
              rightIcon={<Icon icon="mdi:arrow-right" />}
            >
              With Right Icon
            </Button>
            <Button variant="primary" fullWidth>
              Full Width Button
            </Button>
          </div>
        </div>
      </Card>

      {/* Card Component Showcase */}
      <div className="mb-10">
        <Text variant="h3" gradient className="mb-6 text-center">
          Card Component
        </Text>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cardData.map((card) => (
            <Card
              key={card.id}
              variant={card.variant}
              hover
              width="100%"
              className="h-full"
            >
              <div className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 p-3 rounded-full bg-[#FF7800]/20">
                  <Icon
                    icon={card.icon}
                    width={32}
                    height={32}
                    className="text-[#FF7800]"
                  />
                </div>
                <Text variant="h4" className="mb-2">
                  {card.title}
                </Text>
                <Text variant="bodySmall" color="subtle" className="mb-4">
                  {card.description}
                </Text>
                <Button
                  variant="outlineOrange"
                  onClick={() => {
                    setSelectedCard(card);
                    setIsModalOpen(true);
                  }}
                >
                  Learn More
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Accordion Component Showcase */}
      <Card
        variant="dark"
        className="mb-10"
        width="100%"
        maxWidth="1200px"
        padding="30px"
        mx="auto"
      >
        <Text variant="h3" gradient className="mb-6">
          Accordion Component
        </Text>

        <div className="space-y-4">
          {accordionData.map((accordion, index) => (
            <Accordion
              key={index}
              title={accordion.title}
              icon={accordion.icon}
              iconColor={accordion.iconColor}
              gradientFrom={accordion.iconColor}
              defaultOpen={index === 0}
              borderColor="#333"
              bgColor="rgba(26,26,26,0.8)"
              shadowColor="rgba(0,0,0,0.2)"
            >
              <div className="p-4">
                <Text variant="body">{accordion.content}</Text>
              </div>
            </Accordion>
          ))}
        </div>
      </Card>

      {/* Modal Component Showcase */}
      <div className="text-center mb-20">
        <Text variant="h3" gradient className="mb-6">
          Modal Component
        </Text>
        <Button
          variant="primary"
          size="large"
          onClick={() => setIsModalOpen(true)}
        >
          Open Modal
        </Button>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCard ? selectedCard.title : "Modal Demo"}
        primaryButtonText="Confirm"
        secondaryButtonText="Cancel"
        primaryButtonAction={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          {selectedCard ? (
            <>
              <div className="flex items-center justify-center p-3 mb-4">
                <Icon
                  icon={selectedCard.icon}
                  width={48}
                  height={48}
                  className="text-[#FF7800]"
                />
              </div>
              <Text variant="body">
                This is detailed information about the{" "}
                {selectedCard.title.toLowerCase()} option. Here you would find
                comprehensive details about what's included, benefits, and how
                to get started.
              </Text>
            </>
          ) : (
            <>
              <Text variant="body">
                This is a demo of the Modal component. It can be used for
                confirmations, forms, alerts, and more. The modal has
                customizable header, content, and footer sections.
              </Text>
              <Text variant="bodySmall" color="subtle" className="mt-2">
                Press ESC key or click outside to close this modal.
              </Text>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
