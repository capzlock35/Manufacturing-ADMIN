import Employee from "../model/newEmployeeModel.js";

const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    };
    const createEmployee = async (req, res) => {
        try {
            const { firstName, lastName, email, middleName, age, birthday, gender, address, department, role } = req.body;
    
            // Create new user
            const newEmployee = new Employee({
                firstName,
                lastName,
                email,
                middleName,
                age,
                birthday,
                gender,
                address,
                department,
                role
            });
    
            // Save the user
            await newEmployee.save();
    
            res.status(201).json({ message: "User created successfully", user: newEmployee });
    
        } catch (error) {
            console.error("Error creating user:", error);
            res.status(500).json({ message: "Failed to create user",  error:error.message });
        }
    };
export {getEmployees, createEmployee};