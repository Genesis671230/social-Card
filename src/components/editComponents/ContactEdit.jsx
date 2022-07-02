import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DarkModeContext } from '../../context/darkModeContext';

export default function ContactEdit({ title, downloadIcon, vcard }) {
  const { darkMode } = useContext(DarkModeContext);
  const [data, setData] = useState();
  const [arr, setArr] = useState({});

  const location = useLocation();

  const handleInputs = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setArr({ ...arr, [name]: value });
  };

  useEffect(() => {
    const dis = [];
    for (const value of Object.entries(vcard)) {
      const arr = {};
      arr[value[0]] = value[1];
      dis.push(arr);
    }
    setData(dis);
    setArr(vcard);
  }, []);

  return (
    <div
      className={`w-full  border-2 p-5 ${
        darkMode ? 'text-white border-white' : 'text-black border-black'
      }  rounded-lg border-white`}
    >
      <div className=" flex justify-between ">
        <div className="text-xl  font-bold mb-2">{title}</div>

        <div>{downloadIcon}</div>
      </div>
      {data && (
        <div>
          {data.map((item) => {
            const [value] = Object.entries(item);

            return (
              <div key={value[0]}>
                <form>
                  <label>{value[0]}</label>
                  {/* <input name={key} onChange={handleInputs}  type="text" defaultValue={value}/> */}

                  <input
                    className="border-2 border-red-800 rounded-lg m-2 w-full"
                    id={value[0]}
                    name={value[0]}
                    // type={input}
                    defaultValue={value[1]}
                    onChange={handleInputs}
                  />
                </form>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
