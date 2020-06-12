import React, {useState} from 'react';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import { languageList } from "../utils/languageList"


type InputProps = {
  userName: string,
  language: string,
  setUserName: (userName :string) => void,
  setLanguage: (language :string) => void,
}


export const InputBox: React.FC<InputProps> = ({userName, language, setUserName, setLanguage}) => {
  const [inputValue, setInputValue] = useState(userName)
  
  const languages = languageList;

  const handleChageInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }
  const handleEnterInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setUserName(inputValue)
    }
  };

  const handleBlurInput = (event: React.FocusEvent<HTMLInputElement>) => {
    setUserName(event.target.value)
  }

  const handleChangeLanguage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLanguage(event.target.value);
  };

  return (
        <>
          <TextField
            id="user-input" 
            label="UserName" 
            onChange={handleChageInput}
            onKeyPress={handleEnterInput}
            onBlur={handleBlurInput}
            value={inputValue}
          />
          <TextField
            id="language-input"
            select
            label="Language"
            value={language}
            onChange={handleChangeLanguage}
          >
            {languages.map((language) => (
              <MenuItem key={language} value={language}>
                {language}
              </MenuItem>
            ))}
          </TextField>
        </>
  );
}

