import React, { useState, useEffect } from 'react';
import SearchBar from '../../components/SearchBar/index';
import EditBar from '../../components/EditBar';
import { Container, Col, Row } from 'react-bootstrap';
import DropDownInput from '../../components/DropDownInput/index';
import DataTable from '../../components/DataTable';
import API from '../../utils/employeesAPI';
import InputModal from '../../components/InputModal';
import { set } from 'mongoose';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false); // using
  const [employeeInfo, setEmployeeInfo] = useState({}); //using
  const [inputs, setInputs] = useState([]); //using
  const [selectedEmployees, setSelectedEmployees] = useState([]) //using
  const [modalTitle, setModalTitle] = useState(); //using
  const [submitButtonLabel, setSubmitButtonLabel] = useState(`Submit`);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = () => {
    API.getEmployees()
      .then(res => {
        setEmployees(res.data);
        setFilteredEmployees(res.data);
      })
      .catch(err => console.error(err));
  }

  const updateFilteredEmployeesState = event => {
    const inputText = event.target.value;
    setFilteredEmployees(
      employees.filter(employee => {
        const words = employee.name.split(' ');
        let isMatch = false;
        words.forEach(word => {
          if (word.toLowerCase().startsWith(inputText.toLowerCase())) {
            isMatch = true;
          }
        });
        return isMatch;
      })
    );
  }

  const updateEmployeeInfoState = event => {
    const { name, value } = event.target;
    setEmployeeInfo(info => ({ ...info, [name]: value }));
  }

  const employeeNameInput = [
    {
      name: `name`,
      label: `Employee Name`,
      type: `text`,
      text: `Full name (e.g. John Smith)`,
      placeholder: `Enter name`,
      onChange: updateEmployeeInfoState
    },
    {
      name: `id`,
      label: `PIN`,
      type: `number`,
      text: `Enter 6 digits (e.g. 000000)`,
      placeholder: `Enter PIN`,
      onChange: updateEmployeeInfoState
    }
  ]

  const otherInput = [
    {
      name: `position`,
      label: `Position`,
      type: `text`,
      text: `Required (e.g. Server)`,
      placeholder: `Enter position`,
      onChange: updateEmployeeInfoState
    },
    {
      name: `rate`,
      label: `Hourly Rate`,
      type: `number`,
      text: `Required (format: 0.00)`,
      placeholder: `Enter hourly rate`,
      onChange: updateEmployeeInfoState
    },
    {
      name: `permission`,
      label: `Permission`,
      type: `number`,
      text: `Permission level from 0 to 5, where 0 has most access`,
      placeholder: `Set permission level`,
      onChange: updateEmployeeInfoState
    }
  ]

  const employeeTableHeadingArr = [
    { key: `name`, heading: `Employee Name` },
    { key: `id`, heading: `Employee PIN` },
    { key: `position`, heading: `Position` },
    { key: `rate`, heading: `Hourly Rate` },
    { key: `permission`, heading: `Permission Level` }
  ];


  const addButtonPressed = () => {
    setInputs([...employeeNameInput, ...otherInput]);
    setModalTitle(`Add a new employee`);
    setSubmitButtonLabel(`Submit`);
    setShowModal(true);
  }

  const closeEmployeeModal = () => setShowModal(false);

  const editButtonPressed = () => {
    console.log(`Edit button pressed!`)
    if (selectedEmployees.length > 1) {
      console.log(`More than 1 employee selected`)
      setInputs(otherInput);
      setModalTitle(`Edit employees`);
    } else {
      console.log(`Only 1 employee selected`)
      setInputs([...employeeNameInput, ...otherInput]);
      setModalTitle(`Edit an employee`);
    }
    setSubmitButtonLabel(`Save`);
    setShowModal(true)
  }

  const deleteButtonPressed = () => {
    console.log(`Delete button pressed`)
    API.deleteManyEmployee(selectedEmployees)
      .then(res => {
        console.log(`status code: ${res.status}`);
        if (res.data.n > 0) {
          loadEmployees();
        }
      })
      .catch(err => console.error(err));
  }

  const checkboxClicked = event => {
    const checked = event.target.checked;
    const selectedId = event.target.getAttribute(`data-id`);
    if (checked) {
      setSelectedEmployees([...selectedEmployees, selectedId])
    } else {
      setSelectedEmployees(selectedEmployees.filter(id => id !== selectedId));
    }
  }

  const submitButtonPressed = event => {
    event.preventDefault();
    if (
      employeeInfo.name &&
      employeeInfo.id &&
      employeeInfo.position &&
      employeeInfo.permission &&
      employeeInfo.rate
    ) {
      console.log(`Making a POST call`)
      API.addEmployee(employeeInfo).then(res => {
        console.log(`status code: ${res.status}`);
        closeEmployeeModal();
        loadEmployees();
      });
    } else {
      alert(
        'Please fill in all required fields to add an employee'
      );
    }
  }

  const saveButtonPressed = event => {
    console.log(`Save button pressed`);
    
  }

  return (
    <div>
      <h1 className='d-flex justify-content-center display-4 text-white mt-5'>
        Employees
      </h1>
      <Container className='mb-3 mt-5'>
        <SearchBar
          placeholder='Search employees'
          className='col-12 rounded-sm'
          onChange={updateFilteredEmployeesState}
        />
      </Container>

      <div
        className=' d-flex row justify-content-center align-items-center text-white'
        id='buttonsDiv'>
        <div className='m-1'>
          <DropDownInput className='d-flex justify-content-center'>
            Sort by vendor
          </DropDownInput>
        </div>
      </div>

      <InputModal
        show={showModal} // bool
        cancel={closeEmployeeModal}
        title={modalTitle}
        submit={submitButtonLabel === `Submit` ? submitButtonPressed : saveButtonPressed}
        submitButtonLabel={submitButtonLabel}
        inputs={inputs} // array of input objs
      />

      <Container className='d-flex justify-content-center mt-5'>
        <Col>
          <Row className='mb-1'>
            <EditBar noneSelected={selectedEmployees.length ? false : true}
              add={addButtonPressed}
              edit={editButtonPressed}
              delete={deleteButtonPressed}
            />
          </Row>
          <Row>
            <DataTable
              headingArr={employeeTableHeadingArr}
              dataArr={filteredEmployees}
              hideEdit={false}
              clickCheckbox={checkboxClicked}
            />
          </Row>
        </Col>
      </Container>

    </div>
  );
}

export default Employees;
