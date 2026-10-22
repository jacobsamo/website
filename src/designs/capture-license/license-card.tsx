/**
 * This component is for a visual representation of austrlian license cards for quick capture and display when inputting inforation
 * When shown in the UI we will highlight a portion of the card to show the user where to find the information to be filled
 * It fill flip and change just like the camera view does
 */


const FrontCard = () => {
	return (
		<div>

            {/* Top portion */}
			<span>Driver License</span>

            <div>
                <span>License NO. / CRN</span>
                <span>000 000 000</span>
            </div>

			<div>
				<span>Smith</span>
				<span>John</span>
			</div>

            {/* Middle portion */}

            <img src="/images/license-front.png" alt="License Front" />


            {/* Bottom portion */}
            <img src="/images/license-signature.png" alt="License Bottom" />

            <div>
                <img src="/images/gov-logo.png" alt="Government Logo" />
                <span>State Government</span>
            </div>
		</div>
	);
};


const CardBack = () => {
	return (
        <div>
            {/* Top portion */}
            <span>Number, road</span>
            <span>state, postcode</span>

            {/* Middle portion */}
            <img src="/images/queensland-logo.png" alt="License Back" />

            {/* Bottom portion */}
            <span>Drive Safely</span>
            <div>
                <span>Card number</span>
                <span>000 000 000 0</span>
            </div>
        </div>
    )
}