import '../styles/questions.scss';
import {ReactNode} from 'react';

type QuestionsProps = {
    content: string;
    author: {
        name: string;
        avatar:  string;
    }
    children?: ReactNode;
    isHighlighted?: boolean;
    isAnswered?: boolean;
}


export function Questions({content, author, children, isAnswered = false, isHighlighted = false}: QuestionsProps){
    return(
        <div className={`questions  ${isAnswered ? 'answered' : ''} ${isHighlighted ? 'highlighted' : ''}` }>
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name}/>
                    <span>{author.name}</span>
                </div>
                <div>
                    {children}
                </div>
            </footer>
        </div>
    );
}