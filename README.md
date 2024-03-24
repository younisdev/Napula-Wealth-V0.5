# Napula Wealth (V0.5)


Napula Wealth is a platform that combines three main features: stock tracking, budget management, and currency conversion, aimed to provide users with a comprehensive tool for managing their financial state and improving it. Whether you're an investor, a budgeter, or someone who wants to convert currency easily, Napula Wealth offers all of these and more in one platform with top-notch security and privacy.


# Distinctiveness and Complexity:


Napula Wealth stands out from all other old CS50 web projects due to its unique combination of features aimed at providing significant value to a broad audience, including investors, business owners, and programmers. With its comprehensive APIs targeting these audiences through all devices, including PCs, and responsive, well-designed interfaces on mobile, Napula Wealth offers unparalleled accessibility and usability. The combination of real-time data APIs ensures updated data and enriches the user experience with the help of our custom API and databases. With the help of Django for the backend and React, HTML, CSS, and MySQL as a temporary database, including 11 tables for the frontend, we were able to create a user-friendly interface and features that adhere to modern website design rules and security standards. Additionally, we have incorporated historical data from well-known and trustworthy platforms and experts such as Nasdaq. With over one thousand lines of code in Python Django views files, which form 21 APIs and 7 actual routes comprising HTML layouts that inherit the design from layout.html, a large CSS codebase, and the usage of well-known libraries like Bootstrap and Bootstrap React, we provide users with a visually appealing and responsive experience. Our routes prioritize security, scalability, and maintainability, ensuring that the codebase remains secure and easily maintainable.

Furthermore, we have incorporated a tiny machine learning model using PyTorch for learning purposes (which may have some issues). This presented a valuable opportunity to delve into the workings of AI, including tensors and neural networks, and the challenges of data acquisition and model training. These processes require significant computational resources, whether from CPU power or NVIDIA CUDA cores in RTX or GTX GPUs, highlighting the complexity and resource-intensive nature of AI development.


In addition, Napula Wealth has been a significant learning opportunity, scaling our knowledge to new heights. It has enhanced our problem-solving skills, algorithmic thinking, and proficiency in both Django and React, contributing to our professional growth.


# File Description:


- models.py: Defines the Django database models, encompassing 11 tables for various purposes such as user authentication, trackers, caching tables, stocks historical data, and data holders.

- urls.py: Defines all necessary routes and paths for the app, including 21 API routes and 7 actual routes.

- views.py: Defines all necessary views, composed of APIs and regular views, totaling over thousands of lines.

- helper.py: Plays a crucial role in aiding the alpha version AI model (investai.pth) by providing it with a neural network class that the model is trained on.

- templates\investment: Contains 8 HTML files, one of which is layout.html, defining the layout of the application and holding React and ReactDOM UMD links. The other 7 files extend upon it with Django templates.

- static\files.jsx: Contains all the JSX files used and is utilized to transform them into JavaScript files using the esbuild converter.

- static\investment: Contains all the converted '.js' files.


# How to Run the Application:


1- Clone the repository to your machine.

2 - Navigate to the project directory.

3 - Download all the required files listed in requirements.txt.

4 - Run the Django development server using the command: python manage.py runserver.


# Done by: Younis Ayoub.

# This was CS50 Web.









