import { useContext, useState } from 'react';
import commonContext from '../contexts/common/commonContext';

const useForm = () => {
    const { toggleForm, setFormUserInfo } = useContext(commonContext);
    const [inputValues, setInputValues] = useState({});

    // handling input-values
    const handleInputValues = (e) => {
        const { name, value } = e.target;

        setInputValues((prevValues) => {
            return {
                ...prevValues,
                [name]: value
            };
        });
    };

    // handling form-submission
   
    return { inputValues, handleInputValues };
};

export default useForm;