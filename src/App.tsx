import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  Flex,
  VStack,
  Heading,
  Input,
  Textarea,
  Button,
  Text,
  Checkbox,
  useDisclosure,
} from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import {
  AddIcon,
  CloseIcon,
  HamburgerIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { Select } from "@chakra-ui/react";

interface Widget {
  id: string;
  name: string;
  content: string;
  isChecked?: boolean;
}

interface Category {
  name: string;
  shortForm: string;
  widgets: Widget[];
}

interface DashboardData {
  categories: Category[];
}

const initialDashboardData: DashboardData = {
  categories: [
    {
      name: "CSPM Executive Dashboard",
      shortForm: "CSPM",
      widgets: [
        {
          id: "cloud-accounts",
          name: "Cloud Accounts",
          content: "Cloud Accounts Widget",
        },
        {
          id: "risk-assessment",
          name: "Cloud Account Risk Assessment",
          content: "Risk Assessment Widget",
        },
      ],
    },
    {
      name: "CWPP Dashboard",
      shortForm: "CWPP",
      widgets: [
        {
          id: "namespace-alerts",
          name: "Top 5 Namespace Specific Alerts",
          content: "Namespace Alerts Widget",
        },
        {
          id: "workload-alerts",
          name: "Workload Alerts",
          content: "Workload Alerts Widget",
        },
      ],
    },
    {
      name: "Registry Scan",
      shortForm: "RS",
      widgets: [
        {
          id: "image-risk",
          name: "Image Risk Assessment",
          content: "Image Risk Widget",
        },
        {
          id: "security-issues",
          name: "Image Security Issues",
          content: "Security Issues Widget",
        },
      ],
    },
  ],
};

const DynamicDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] =
    useState<DashboardData>(initialDashboardData);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [newWidgetName, setNewWidgetName] = useState<string>("");
  const [newWidgetContent, setNewWidgetContent] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [tempDashboardData, setTempDashboardData] =
    useState<DashboardData>(initialDashboardData);
  const [isAddingToSpecificCategory, setIsAddingToSpecificCategory] =
    useState<boolean>(false);

  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  useEffect(() => {
    setTempDashboardData({
      categories: dashboardData.categories.map((category) => ({
        ...category,
        widgets: category.widgets.map((widget) => ({
          ...widget,
          isChecked: true,
        })),
      })),
    });
  }, [dashboardData]);

  const addWidget = (categoryName: string) => {
    if (newWidgetName && newWidgetContent && categoryName) {
      const newWidget: Widget = {
        id: Date.now().toString(),
        name: newWidgetName,
        content: newWidgetContent,
      };

      setDashboardData((prevData) => ({
        ...prevData,
        categories: prevData.categories.map((category) =>
          category.name === categoryName
            ? { ...category, widgets: [...category.widgets, newWidget] }
            : category
        ),
      }));

      handleModalClose();
    }
  };

  const removeWidget = (categoryName: string, widgetId: string) => {
    setDashboardData((prevData) => ({
      ...prevData,
      categories: prevData.categories.map((category) =>
        category.name === categoryName
          ? {
              ...category,
              widgets: category.widgets.filter(
                (widget) => widget.id !== widgetId
              ),
            }
          : category
      ),
    }));
  };

  const toggleWidget = (categoryName: string, widgetId: string) => {
    setTempDashboardData((prevData) => ({
      ...prevData,
      categories: prevData.categories.map((category) =>
        category.name === categoryName
          ? {
              ...category,
              widgets: category.widgets.map((widget) =>
                widget.id === widgetId
                  ? { ...widget, isChecked: !widget.isChecked }
                  : widget
              ),
            }
          : category
      ),
    }));
  };

  const applyChanges = () => {
    const updatedDashboardData: DashboardData = {
      categories: tempDashboardData.categories.map((category) => ({
        ...category,
        widgets: category.widgets.filter((widget) => widget.isChecked),
      })),
    };
    setDashboardData(updatedDashboardData);
    onDrawerClose();
  };

  const cancelChanges = () => {
    setTempDashboardData({
      categories: dashboardData.categories.map((category) => ({
        ...category,
        widgets: category.widgets.map((widget) => ({
          ...widget,
          isChecked: true,
        })),
      })),
    });
    onDrawerClose();
  };

  const handleAddWidgetClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setIsAddingToSpecificCategory(true);
    onModalOpen();
  };

  const handleModalClose = () => {
    setSelectedCategory("");
    setNewWidgetName("");
    setNewWidgetContent("");
    setIsAddingToSpecificCategory(false);
    onModalClose();
  };

  const getSelectedCategoryShortForm = () => {
    const category = dashboardData.categories.find(
      (c) => c.name === selectedCategory
    );
    return category ? category.shortForm : "";
  };

  const filteredCategories = dashboardData.categories.map((category) => ({
    ...category,
    widgets: category.widgets.filter((widget) =>
      widget.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  }));

  return (
    <ChakraProvider>
      <Box p={4} maxW="1440">
        <Flex justify="space-between" mb={4} marginBottom={20}>
          <Input
            placeholder="Search widgets..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            width="350px"
            h="42px"
            backgroundColor="#fff"
          />
          <Flex>
            <Button
              leftIcon={<AddIcon />}
              onClick={() => {
                setIsAddingToSpecificCategory(false);
                onModalOpen();
              }}
              mr={2}
              backgroundColor="#088F8F"
              color="white"
              _hover={{ bg: "#AFE1AF", color: "#1a1a1a" }}
            >
              Add Widget
            </Button>
            <Button
              leftIcon={<HamburgerIcon />}
              onClick={onDrawerOpen}
              variant="outline"
            >
              Manage Widgets
            </Button>
          </Flex>
        </Flex>

        {filteredCategories.map((category) => (
          <Box key={category.name} mb={6}>
            <Heading size="md" mb={2}>
              {category.name}
            </Heading>
            <Flex maxW="100%" overflow="auto" direction="row" gap={4}>
              {category.widgets.map((widget) => (
                <Box
                  key={widget.id}
                  borderWidth={1}
                  borderRadius="lg"
                  p={4}
                  backgroundColor="#fff"
                  minW="250px"
                  maxW="250px"
                  pr="60px"
                  position="relative"
                  h="150px"
                  overflowY="auto"
                >
                  <Button
                    w="15px"
                    size="sm"
                    position="absolute"
                    top={2}
                    right={2}
                    _hover={{ bg: "#FF5733", color: "#fff" }}
                    bg="white"
                    onClick={() => removeWidget(category.name, widget.id)}
                  >
                    <CloseIcon />
                  </Button>
                  <Heading size="sm" mb={2}>
                    {widget.name}
                  </Heading>
                  <Text>{widget.content}</Text>
                </Box>
              ))}
              <Box
                p={4}
                borderWidth={1}
                borderRadius="lg"
                minW="250px"
                position="relative"
                backgroundColor="#fff"
                display="flex"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                minH="150px"
                onClick={() => handleAddWidgetClick(category.name)}
              >
                <AddIcon />
              </Box>
            </Flex>
          </Box>
        ))}

        <Modal isOpen={isModalOpen} onClose={handleModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              Add New Widget{" "}
              {selectedCategory && `in ${getSelectedCategoryShortForm()}`}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <Input
                  placeholder="Widget Name"
                  value={newWidgetName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewWidgetName(e.target.value)
                  }
                />
                <Textarea
                  placeholder="Widget Content"
                  value={newWidgetContent}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setNewWidgetContent(e.target.value)
                  }
                />
                {!isAddingToSpecificCategory && (
                  <Select
                    placeholder="Select Category"
                    value={selectedCategory}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setSelectedCategory(e.target.value)
                    }
                  >
                    {dashboardData.categories.map((category) => (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                )}
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={handleModalClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => addWidget(selectedCategory)}
                isDisabled={
                  !selectedCategory || !newWidgetName || !newWidgetContent
                }
              >
                Add Widget
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Drawer isOpen={isDrawerOpen} placement="right" onClose={onDrawerClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Manage Widgets</DrawerHeader>
            <DrawerBody>
              <Tabs>
                <TabList>
                  {tempDashboardData.categories.map((category) => (
                    <Tab key={category.shortForm} width="fit-content">
                      <Heading size="sm" color="black">
                        {category.shortForm}
                      </Heading>
                    </Tab>
                  ))}
                </TabList>
                <TabPanels>
                  {tempDashboardData.categories.map((category) => (
                    <TabPanel key={category.name}>
                      <VStack
                        align="stretch"
                        spacing={4}
                        maxHeight="60vh"
                        overflowY="auto"
                      >
                        {category.widgets.map((widget) => (
                          <Checkbox
                            key={widget.id}
                            isChecked={widget.isChecked}
                            onChange={() =>
                              toggleWidget(category.name, widget.id)
                            }
                          >
                            {widget.name}
                          </Checkbox>
                        ))}
                      </VStack>
                    </TabPanel>
                  ))}
                </TabPanels>
              </Tabs>
            </DrawerBody>
            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={cancelChanges}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={applyChanges}>
                Confirm
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Box>
    </ChakraProvider>
  );
};

export default DynamicDashboard;
